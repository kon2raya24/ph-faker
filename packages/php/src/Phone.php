<?php

declare(strict_types=1);

namespace PhDevUtils\Faker;

final class Phone
{
    /** @var array<string, array<int, string>> */
    private array $networkPrefixes;
    /** @var array<int, string> */
    private array $landlineAreaCodes = [
        '2', '32', '33', '34', '38', '42', '43', '44', '45', '46', '49', '74', '82', '88',
    ];

    public function __construct(private Rng $rng)
    {
        $raw = DataLoader::load('network-prefixes');
        $this->networkPrefixes = [
            'Globe' => $raw['Globe'],
            'Smart' => $raw['Smart'],
            'Sun' => $raw['Sun'],
            'DITO' => $raw['DITO'],
        ];
    }

    public function mobile(): string
    {
        $network = $this->rng->pick(['Globe', 'Smart', 'Sun', 'DITO']);
        return $this->mobileByNetwork($network);
    }

    public function mobileByNetwork(string $network): string
    {
        if (!isset($this->networkPrefixes[$network])) {
            throw new \InvalidArgumentException("Unknown network: {$network}");
        }
        $prefix = $this->rng->pick($this->networkPrefixes[$network]);
        $subscriber = str_pad((string) $this->rng->nextInt(0, 9999999), 7, '0', STR_PAD_LEFT);
        // E.164: drop leading 0 from prefix, prepend +63
        return '+63' . substr($prefix, 1) . $subscriber;
    }

    public function landline(): string
    {
        $area = $this->rng->pick($this->landlineAreaCodes);
        $subscriberLen = $area === '2' ? 8 : 7;
        $max = (int) (10 ** $subscriberLen - 1);
        $subscriber = str_pad((string) $this->rng->nextInt(0, $max), $subscriberLen, '0', STR_PAD_LEFT);
        $formatted = $subscriberLen === 8
            ? substr($subscriber, 0, 4) . '-' . substr($subscriber, 4)
            : substr($subscriber, 0, 3) . '-' . substr($subscriber, 3);
        return "(0{$area}) {$formatted}";
    }
}
