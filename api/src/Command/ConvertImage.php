<?php

namespace App\Command;

use App\Entity\File;
use App\Service\Image as ImageService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ConvertImage extends Command
{
    private $pdo;
    private $imageService;
    private $targetDir;

    public function __construct(string $dsn, string $targetDir, ImageService $imageService)
    {
        parent::__construct();
        $this->imageService = $imageService;
        $this->pdo = new \PDO($dsn, null, null);

        $this->targetDir = realpath($targetDir);

        if (!$this->targetDir) {
            throw new \Exception("Target directory (".$this->targetDir.") could not be found !");
        }

        if (!is_writeable($this->targetDir)) {
            throw new \Exception("Target directory (".$this->targetDir.") is not writable !");
        }
    }

    protected function configure()
    {
        $this->setName('zusam:convert-image')
            ->setDescription('Converts a raw image file.')
            ->setHelp('This command search for a raw image file in the database and converts it.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $c = $this->pdo->query("SELECT id, content_url FROM file WHERE id IN (SELECT file_id FROM messages_files) AND status = '".File::STATUS_RAW."' AND type LIKE 'image%';");
        while($rawFile = $c->fetch()) {
            $outputFile = $this->targetDir."/".$rawFile["id"];
            $output->writeln(["Converting ".$rawFile["content_url"]]);  
            $this->imageService->createThumbnail(
                $this->targetDir."/".$rawFile["content_url"],
                $outputFile.".converted",
                2048,
                2048
            );
            rename($outputFile.".converted", $outputFile.".jpg");
            $q = $this->pdo->prepare("UPDATE file SET content_url = '".$rawFile["id"].".jpg', status = '".File::STATUS_READY."', type = 'image/jpeg' WHERE id = '".$rawFile["id"]."';");
            $q->execute();
            return;
        }
    }
}