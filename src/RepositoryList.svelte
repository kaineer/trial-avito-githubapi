<script>
  import Header from './RepositoryList/Header.svelte';
  import RepositoryItem from './RepositoryList/Item.svelte';

  export let items;
  export let loading;
  export let term;
</script>

<Header/>
{#each items as item, i}
  <RepositoryItem {term} {item} {loading} orderId={i} />
{/each}

<style>
  .repository-list {
    margin-top: 8px;
    margin-left: 8px;
    border-spacing: 0;
  }

  .repository-list td,
  .repository-list th {
    padding: 8px;
  }

  .repository-list td {
    text-align: left;
  }
</style>
