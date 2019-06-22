<?php

$files = ['popup'];

$root = realpath(__DIR__ . "/..");
$svg = function(string $name) {
    require realpath(__DIR__) . "/assets/src/svgs/compressed/{$name}.svg";
};

foreach ($files as $file) {
    $input = realpath(__DIR__) . "/views/{$file}.php";
    $output = "{$root}/{$file}.html";

    ob_start();

    require $input;

    file_put_contents($output, ob_get_clean());
}
