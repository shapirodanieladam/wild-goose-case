import subprocess
import click

@click.group()
def cli():
    """Polyglot CLI Controller"""
    pass

@cli.command()
@click.option('--service', type=click.Choice(['frontend', 'backend', 'all']), default='all', help='Select which service to scaffold tests for.')
def generate(service):
    """Generate tests for selected services."""
    if service in ['frontend', 'all']:
        click.echo('🔧 Generating frontend tests using Cypress (TypeScript)...')
        subprocess.run(['node', './frontend-tester/smart-cli.js'])

    if service in ['backend', 'all']:
        click.echo('🔧 Generating backend tests using Kotlin...')
        subprocess.run(['./backend-tester/build/backend-cli'])

    click.echo('✅ Test generation complete.')

@cli.command()
def run_all():
    """Run all generated tests."""
    click.echo('🚀 Running frontend tests...')
    subprocess.run(['npx', 'cypress', 'run'], cwd='./frontend-tester')

    click.echo('🚀 Running backend tests...')
    subprocess.run(['./backend-tester/build/run-tests'])

    click.echo('✅ All tests executed successfully.')

if __name__ == '__main__':
    cli()