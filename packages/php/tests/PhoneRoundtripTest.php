<?php

declare(strict_types=1);

namespace PhDevUtils\Faker\Tests;

use PhDevUtils\Faker\DataLoader;
use PhDevUtils\Faker\Faker;
use PHPUnit\Framework\TestCase;

// Inline-mirror of ph-dev-utils' parseMobile prefix→network lookup.
// Keep in sync if data/network-prefixes.json adds/removes a network.
final class PhoneRoundtripTest extends TestCase
{
    /** @var array<string, string> */
    private static array $networkMap = [];

    public static function setUpBeforeClass(): void
    {
        $prefixes = DataLoader::load('network-prefixes');
        foreach ($prefixes as $network => $list) {
            if (str_starts_with($network, '_')) continue;
            foreach ($list as $p) {
                self::$networkMap[$p] = $network;
            }
        }
    }

    /** @dataProvider networkProvider */
    public function testMobileByNetworkUsesCorrectPrefix(string $network): void
    {
        $f = new Faker(999);
        for ($i = 0; $i < 200; $i++) {
            $num = $f->phone->mobileByNetwork($network);
            // +63XXX... → reconstruct 0XXX prefix
            $prefix = '0' . substr($num, 3, 3);
            $this->assertSame($network, self::$networkMap[$prefix] ?? null, "prefix {$prefix} for {$num}");
        }
    }

    /** @return array<int, array{string}> */
    public static function networkProvider(): array
    {
        return [['Globe'], ['Smart'], ['Sun'], ['DITO']];
    }

    public function testMobileEmitsE164(): void
    {
        $f = new Faker(7);
        for ($i = 0; $i < 200; $i++) {
            $this->assertMatchesRegularExpression('/^\+63\d{10}$/', $f->phone->mobile());
        }
    }

    public function testLandlineFormat(): void
    {
        $f = new Faker(13);
        for ($i = 0; $i < 200; $i++) {
            $this->assertMatchesRegularExpression('/^\(0\d{1,2}\) \d{3,4}-\d{4}$/', $f->phone->landline());
        }
    }
}
