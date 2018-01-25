# github-rollcall

Lists a GitHub organization's members

## Usage

Get help:

```
node cli.js --help
```

Outputs a JSON list of members in MyOrganization:

```
node cli.js MyOrganization
```

Outputs a CSV list of members in MyOrganization:

```
node cli.js -o csv MyOrganization
```

## Authentication

To use a [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) for authentication, set it in your GITHUB_ACCESS_TOKEN environment variable before running this script.
