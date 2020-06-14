<script>
  export let total;
  export let current;
  export let max;
  export let pageUrlGenerator;

  let pages;

  const getPages = (max, total) => {
    let pages = [];

    for (let i = 0; i < Math.min(max, total); i++) {
      pages.push(i + 1);
    }

    return pages;
  };

  $: pages = getPages(max, total);
</script>

<ul>
  {#each pages as pageId}
    <li class={current === pageId ? 'current' : ''}>
      <a href={pageUrlGenerator(pageId)}>{pageId}</a>
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    margin: 8px;
    padding: 0;
  }

  li {
    display: inline-block;
    float: left;
  }

  li a {
    display: block;
    width: 60px;
    line-height: 60px;

    text-align: center;
    font-size: 24px;

    background-color: #fff;
    color: #000;
    border: solid 1px #000;
    border-radius: 50%;
    text-decoration: none;
    margin-right: 10px;
  }

  li a:hover {
    background-color: #A5AAE1;
  }

  li.current a {
    background-color: #A5AAE1;
    color: #000;
  }
</style>
