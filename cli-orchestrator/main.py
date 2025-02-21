import subprocess
import time
import sys
import click
import requests
from pathlib import Path

def check_service_health(url, max_retries=5, delay=2):
    """Check if a service is healthy with retries."""
    for i in range(max_retries):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                return True
        except requests.RequestException:
            pass
        if i < max_retries - 1:
            time.sleep(delay)
    return False

def ensure_test_fixtures_running():
    """Ensure the test fixtures are up and running."""
    click.echo('🔍 Checking test fixtures...')
    
    # Check if services are already running
    if not check_service_health('http://localhost:3000/health'):
        click.echo('📦 Starting test fixtures...')
        subprocess.run(['docker-compose', 'up', '-d'], cwd='./test-fixtures')
        
        # Wait for services to be healthy
        if not check_service_health('http://localhost:3000/health'):
            click.echo('❌ Failed to start test fixtures')
            sys.exit(1)
    
    click.echo('✅ Test fixtures are running')

@click.group()
def cli():
    """Polyglot CLI Controller"""
    pass

@cli.command()
@click.option('--service', type=click.Choice(['frontend', 'backend', 'all']), default='all', help='Select which service to scaffold tests for.')
def generate(service):
    """Generate tests for selected services."""
    if service in ['frontend', 'all']:
        click.echo('🔧 Generating frontend tests...')
        subprocess.run(['node', './frontend-tester/index.ts'])

    if service in ['backend', 'all']:
        click.echo('🔧 Generating backend tests...')
        subprocess.run(['./backend-tester/build/backend-cli'])

    click.echo('✅ Test generation complete.')

@cli.command()
@click.option('--watch', is_flag=True, help='Run tests in watch mode (interactive)')
def e2e(watch):
    """Run end-to-end tests against the Records Manager."""
    ensure_test_fixtures_running()
    
    click.echo('🚀 Running Records Manager E2E tests...')
    cmd = ['npm', 'run', 'test:e2e:dev' if watch else 'test:e2e:records']
    result = subprocess.run(cmd, cwd='./cli-frontend')
    
    if result.returncode != 0:
        click.echo('❌ E2E tests failed')
        sys.exit(result.returncode)
    
    click.echo('✅ E2E tests completed successfully')

@cli.command()
@click.option('--include-e2e', is_flag=True, help='Include E2E tests in the run')
def run_all(include_e2e):
    """Run all generated tests."""
    if include_e2e:
        ensure_test_fixtures_running()
    
    click.echo('🚀 Running frontend tests...')
    subprocess.run(['npx', 'cypress', 'run'], cwd='./frontend-tester')

    click.echo('🚀 Running backend tests...')
    subprocess.run(['./backend-tester/build/run-tests'])
    
    if include_e2e:
        click.echo('🚀 Running E2E tests...')
        subprocess.run(['npm', 'run', 'test:e2e:records'], cwd='./cli-frontend')

    click.echo('✅ All tests executed successfully.')

if __name__ == '__main__':
    cli()