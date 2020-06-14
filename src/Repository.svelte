<script>
  import {
    getRepository,
    getLanguages,
    getContributors
  } from './requests';
  import {parseHash, buildQuery} from './utils';
  import {formatDate} from './markup';

  import Loading from './Loading.svelte';
  import RepositoryRow from './Repository/Row.svelte';

  let fullName;
  let item = null;
  let languages = null;
  let owner = null;
  let term = null;
  let contributors = null;

  const TitleWidth = 200;
  const DescrWidth = 400;

  const hash = parseHash();

  const pluralize = (value, single, multiple) => {
    if (value === 1) {
      return ''.concat(value, ' ', single);
    } else {
      return ''.concat(value, ' ', multiple);
    }
  };

  fullName = hash.full_name;
  term = hash.term;

  getRepository(fullName).then(d => {
    item = d;
    owner = item.owner;
  });
  getLanguages(fullName).then(d => languages = d);
  getContributors(fullName).then(d => {
    if (d.length > 0) {
      contributors = d.sort((a, b) => {
        return a.contributions - b.contribution
      }).slice(0, 10);
    }

    console.log(contributors);
  });
</script>

{#if term}
  <div class="breadcrumb">
    ← Search: <a href="{'#'.concat(buildQuery({q: term}))}">{term}</a>
  </div>
{/if}

<h1>Repository</h1>
{#if item}
  <RepositoryRow title="Name">
    <a href={item.html_url}>{item.name}</a>{#if item.homepage}, <a href={item.homepage}>homepage</a>{/if}
  </RepositoryRow>
  <RepositoryRow title="Stars">
    { item.stargazers_count }
  </RepositoryRow>
  <RepositoryRow title="Updated">
    { formatDate(item.pushed_at) }
  </RepositoryRow>
  {#if owner}
    <RepositoryRow title="Owner">
      <a href={owner.html_url}>{owner.login}</a><br>
      <img alt="" src={owner.avatar_url} widtn="128" height="128" />
    </RepositoryRow>
  {/if}
  <RepositoryRow title="Languages">
    {#if languages}
      {#each Object.keys(languages) as language, i}
        {i === 0 ? '' : ', '}{ language }
      {/each}
    {:else}
      <Loading />
    {/if}
  </RepositoryRow>
  <RepositoryRow title="Description">
    {item.description}
  </RepositoryRow>
  {#if contributors && contributors.length > 0}
    <RepositoryRow title="Contributors">
      {#each contributors as contributor, i}
        {i === 0 ? '' : ', '}
        <a href={ contributor.html_url } title={ pluralize(contributor.contributions, 'contribution', 'contributions') }>{ contributor.login }</a>
      {/each}
      </RepositoryRow>
  {/if}
{:else}
  <Loading />
{/if}

<style>
  ul {
    list-style: none;
  }

  ul li {
    font-size: 24px;
    text-align: left;
  }

  ul li span {
    color: #435C5C;
  }

  .breadcrumb {
    text-align: left;
    font-size: 24px;
  }

  .loading {
    font-size: 24px;
    color: #BD5F5F;
  }
</style>
