# certinfo

Read a list of certificates from input arguments or stdin. For every certificate, it checks for the expiration date and generates a report table in various formats. Together with the domain list, it exports a list of certificates found.

## Usage

You can use the `-h` or `--help` options to generate the command help message.

```
Usage: certinfo [OPTIONS]... 
Fetches input domain list certificates and shows expirations

  -f, --file    read from space or new line delimited file input
  -h, --help    display this help and exit
  -i, --input   read from space delimited option
  -o, --output  print output to the provided file name
  -r, --report  use only the specified reporter instead of all the availables
  -t, --format  format the output

With no -i or -f options read standard input

Examples:

  certinfo -i "example.com example.net example.org:443"
  certinfo -f domains.txt
  certinfo < domains.txt
  cat domains.txt | certinfo
  certinfo -f input.txt -o output.csv -t csv -r exp
```

## Output formats

Available formats: 

- `terminal`: By default, it outputs the report as a table in the terminal
- `tab`: Tab-separated format for easier spreadsheet cut and paste
- `csv`: Comma-separated values file

Sample terminal output:

```
 Domain expirations:
┌───────────────────┬─────────────────────────────────┬──────────────────────────────────────────┐
│  Hostname         │  Expiration                     │  Serial                                  │
├───────────────────┼─────────────────────────────────┼──────────────────────────────────────────┤
│  google.com       │  Monday, Jun 10, 2024, 19:37    │  F472B4C55824D52009B86703E798BA68        │
│  maps.google.com  │  Monday, Jun 10, 2024, 19:37    │  F472B4C55824D52009B86703E798BA68        │
│  bing.com         │  Thursday, Jun 27, 2024, 23:59  │  3300EE9E4ECA19E1F6B632C5FF000000EE9E4E  │
│  mozilla.org      │  Saturday, Jul 13, 2024, 23:43  │  04ED9A0BBBC8B45F823E53469EAAA8D272A5    │
│  microsoft.com    │  Sunday, Feb 23, 2025, 08:59    │  330025AAEEF214786F48D00A1700000025AAEE  │
│  example.com      │  Saturday, Mar 1, 2025, 23:59   │  075BCEF30689C8ADDF13E51AF4AFE187        │
│  example.org      │  Saturday, Mar 1, 2025, 23:59   │  075BCEF30689C8ADDF13E51AF4AFE187        │
└───────────────────┴─────────────────────────────────┴──────────────────────────────────────────┘

 Found certificates:
┌───────────────────┬─────────────────────────────────┬──────────────────────────────────────────┐
│  CommonName       │  Expiration                     │  Serial                                  │
├───────────────────┼─────────────────────────────────┼──────────────────────────────────────────┤
│  *.google.com     │  Monday, Jun 10, 2024, 19:37    │  F472B4C55824D52009B86703E798BA68        │
│  www.bing.com     │  Thursday, Jun 27, 2024, 23:59  │  3300EE9E4ECA19E1F6B632C5FF000000EE9E4E  │
│  mozilla.org      │  Saturday, Jul 13, 2024, 23:43  │  04ED9A0BBBC8B45F823E53469EAAA8D272A5    │
│  microsoft.com    │  Sunday, Feb 23, 2025, 08:59    │  330025AAEEF214786F48D00A1700000025AAEE  │
│  www.example.org  │  Saturday, Mar 1, 2025, 23:59   │  075BCEF30689C8ADDF13E51AF4AFE187        │
└───────────────────┴─────────────────────────────────┴──────────────────────────────────────────┘
```

## Input format

The input data is a space or newline-separated list of domain names with an optional port number. In case the port is missing, the tool defaults it to port 443.

```txt
example.org example.com
example.net
google.com
```

The data can be provided:

```bash
# stdin
cat "example.com example.org" | certinfo

# file input redirection
certinfo < domains.txt

# command input string 
certinfo -i "example.com example.org"

# command input file
certinfo -f domains.txt
```

## Output 

The reports are sent by default to stdout or written to a file with a specific output format and filtering the generated report.

Available reports:

- `exp`: Expirations list
- `cert`: Collected certificates

```bash
# output a csv to a file
certinfo -i domains.txt -o report.csv -t csv -r exp
```