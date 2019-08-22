<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;

abstract class ApiTestCase extends WebTestCase
{
    protected $em;
    protected $client;

    public function setUp()
    {
        $this->standardSetUp();
    }

    public function tearDown()
    {
        $this->standardTearDown();
    }

    /*
     * Sets the standard initialization set of data
     */
    public function standardSetUp()
    {
        self::bootKernel();

        $application = new Application(static::$kernel);
        $application->setAutoExit(false);
        $application->run(new ArrayInput([
            "command" => "zusam:initialize",
            "user" => "zusam",
            "group" => "zusam",
            "password" => "zusam",
            "--seed" => "zusam",
            "--remove-existing" => true,
            "--env" => "test",
        ]), new NullOutput());

        $this->em = static::$kernel->getContainer()->get('doctrine')->getManager();
        $this->client = static::createClient();
    }

    public function standardTearDown()
    {
        parent::tearDown();
        $this->em->close();
        $this->em = null;
        $this->client = null;
        gc_collect_cycles();
    }
}
