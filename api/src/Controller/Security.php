<?php
namespace App\Controller;

use App\Entity\Group;
use App\Entity\User;
use App\Service\Mailer;
use App\Service\Token;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class Security extends Controller
{
    private $em;
    private $mailer;
    private $encoder;
    private $logger;

    public function __construct(
        LoggerInterface $logger,
        EntityManagerInterface $em,
        Mailer $mailer,
        UserPasswordEncoderInterface $encoder
    ) {
        $this->logger = $logger;
        $this->em = $em;
        $this->mailer = $mailer;
        $this->encoder = $encoder;
    }

    /**
     * @Route("/login", name="login")
     */
    public function login(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $login = urldecode($data["login"]) ?? "";
        $password = $data["password"] ?? "";

        if (empty($login)) {
            return new JsonResponse(["message" => "Login cannot be empty"], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (empty($password)) {
            return new JsonResponse(["message" => "Password cannot be empty"], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $this->em->getRepository(User::class)->findOneByLogin($login);

        if (empty($user)) {
            return new JsonResponse(["message" => "Invalid login/password"], JsonResponse::HTTP_UNAUTHORIZED);
        }

        if (!$this->encoder->isPasswordValid($user, $password)) {
            $this->logger->notice("Invalid password for ".$user->getId(), ["ip" => $_SERVER["REMOTE_ADDR"]]);
            return new JsonResponse(["message" => "Invalid login/password"], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse(["api_key" => $user->getSecretKey()], JsonResponse::HTTP_OK);
    }

    /**
     * @Route("/signup", name="signup")
     */
    public function signup(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $login = urldecode($data["login"]) ?? "";
        $password = $data["password"] ?? "";
        $inviteKey = $data["invite_key"] ?? "";

        if (empty($login)) {
            return new JsonResponse(["message" => "Login cannot be empty"], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (empty($password)) {
            return new JsonResponse(["message" => "Password cannot be empty"], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (empty($inviteKey)) {
            return new JsonResponse(["message" => "You need to have an invite key"], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $this->em->getRepository(User::class)->findOneByLogin($login);

        if (!empty($user)) {
            return new JsonResponse(["message" => "Login already used !"], JsonResponse::HTTP_BAD_REQUEST);
        }

        $group = $this->em->getRepository(Group::class)->findOneByInviteKey($inviteKey);

        if (empty($group)) {
            return new JsonResponse(["message" => "Invalid invite key !"], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setLogin($login);
        $user->setPassword($this->encoder->encodePassword($user, $password));
        $user->setName(explode("@", $login)[0]);
        $user->setData(["mail" => $login]);
        $user->addGroup($group);
        $group->addUser($user);
        $this->em->persist($user);
        $this->em->persist($group);
        $this->em->flush();

        return new JsonResponse(["api_key" => $user->getSecretKey()], JsonResponse::HTTP_OK);
    }

    /**
     * @Route("/password-reset-mail", name="api_password_reset_mail", methods="post")
     */
    public function sendPasswordResetMail(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $mail = $data["mail"] ?? "";
        $user = $this->em->getRepository(User::class)->findOneByLogin($mail);
        if (!$user) {
            return new JsonResponse(["message" => "User not found"], JsonResponse::HTTP_NOT_FOUND);
        }
        $ret = $this->mailer->sendPasswordReset($user);
        if ($ret === true) {
            return new JsonResponse([], JsonResponse::HTTP_OK);
        } else {
            return new JsonResponse($ret, JsonResponse::HTTP_BAD_GATEWAY);
        }
    }

    /**
     * @Route("/new-password", name="api_new-password", methods="post")
     */
    public function newPassword(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $mail = urldecode($data["mail"]) ?? "";
        $password = $data["password"] ?? "";
        $key = $data["key"] ?? "";
        $user = $this->em->getRepository(User::class)->findOneByLogin($mail);
        if (!$user) {
            return new JsonResponse(["message" => "User not found"], JsonResponse::HTTP_NOT_FOUND);
        }
        if (empty($password)) {
            return new JsonResponse(["message" => "Password cannot be blank"], JsonResponse::HTTP_BAD_REQUEST);
        }
        $token_data = Token::decode($key, $user->getPassword());
        if (empty($token_data) || $token_data["sub"] != Token::SUB_RESET_PASSWORD) {
            return new JsonResponse(["message" => "Key is invalid"], JsonResponse::HTTP_BAD_REQUEST);
        }
        $user->setPassword(password_hash($password, PASSWORD_DEFAULT));
        $this->em->persist($user);
        $this->em->flush();
        return new JsonResponse(["api_key" => $user->getSecretKey()], JsonResponse::HTTP_OK);
    }
}
