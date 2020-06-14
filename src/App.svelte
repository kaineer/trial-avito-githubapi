<script>
  import {parseHash} from './utils';
  import Search from './Search.svelte';
  import Repository from './Repository.svelte';

  let type;

  const handleHashChange = () => {
    const hash = parseHash();

    type = hash.type;

    if (!type) {
      type = 'search';
    }
  };

  handleHashChange();

  window.addEventListener('hashchange', handleHashChange);
</script>

<main>
  {#if type === 'search'}
    <Search />
  {:else if type === 'repository'}
    <Repository />
  {:else}
    Undefined page
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
