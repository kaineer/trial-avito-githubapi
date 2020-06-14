<script>
  import {setHash, buildQuery, parseHash, throttle} from './utils';
  import {link, formatDate} from './markup';
  import {searchRepositories} from './requests';

  import RepositoryList from './RepositoryList.svelte';
  import Paginator from './Paginator.svelte';
  import Loading from './Loading.svelte';

  let term = parseHash().q;
  let items = null;
  let total_count;
  let page;
  let loading = false;

  const pageUrlGenerator = (page) => '#'.concat(
    buildQuery({q: term, page})
  );

  const changeHash = () => {
    const hash = parseHash();
    hash.q = term;
    hash.page = 1;
    setHash('#'.concat(buildQuery(hash)));
  };

  const handleHashChange = () => {
    const hash = parseHash();
    const {q} = hash;
    page = hash.page ? parseInt(hash.page, 10) : 1;

    loading = true;
    items = null;

    if (typeof q !== 'undefined') {
      searchRepositories(q, page).then(result => {
        items = result.items;
        total_count = result.total_count;
        loading = false;
      });
    }
  };

  handleHashChange();

  const throttledHandleHashChange = throttle(handleHashChange, 1000);

  window.addEventListener('hashchange', throttledHandleHashChange);
</script>

<h1>Repository search</h1>

<input type="text" class="repository-search" bind:value="{term}" on:input="{changeHash}">

{#if items}
  {#if items.length > 0}
    <div style="width:840px; margin-left: auto; margin-right: auto;">
      <RepositoryList {term} {items} {loading} />
      {#if items.length > 1}
        <Paginator
         {pageUrlGenerator}
         total={Math.ceil(total_count / 10)}
         max={10}
         current={page} />
      {/if}
    </div>
  {:else}
    <div class="message">There's nothing here. Seriously.</div>
  {/if}
{:else}
  {#if term}
    <Loading />
  {/if}
{/if}

<style>
  .repository-search {
    width: 816px;
    font-size: 24px;
  }

  .repository-list {
    margin-top: 8px;
    margin-left: 8px;
    border-spacing: 0;
  }

  .repository-list.repository-list--loading td {
    color: #154242;
    background-color: #196262;
  }

  .repository-list td,
  .repository-list th {
    padding: 8px;
  }

  .repository-list td {
    text-align: left;
  }

  .repository-list thead tr {
    background-color: #D4E7E7;
  }

  .message {
    font-size: 24px;
  }
</style>
