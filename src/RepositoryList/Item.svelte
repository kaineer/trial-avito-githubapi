<script>
  import {link, formatDate} from '../markup';
  import {buildQuery} from '../utils';
  import Row from '../Table/Row.svelte';
  import Cell from '../Table/Cell.svelte';
  import {
    NameWidth,
    StarsWidth,
    DateWidth,
    LinkWidth,
  } from '../Repository/Table';

  export let item;
  export let term;

  const repositoryUrl = (item) => {
    return '#'.concat(
      buildQuery({
        type: 'repository',
        term,
        full_name: item.full_name
      })
    );
  };
</script>

<Row>
  <Cell width={NameWidth}>
    <a href={repositoryUrl(item)}>{ item.name }</a>
  </Cell>
  <Cell width={StarsWidth}>{ item.stargazers_count }</Cell>
  <Cell width={DateWidth}>{ formatDate(item.pushed_at) }</Cell>
  <Cell width={LinkWidth}>
    <a href={item.html_url}>Github</a>
  </Cell>
</Row>

<style>
  .item {
    text-align: left;
    font-size: 24px;
  }

  .item.item-even {
    background-color: #E9F1F1;
  }

  .item.item-odd {
    background-color: #D4E7E7;
  }

  .item td {
    font-size: 24px !important;
    padding: 8px;
  }
</style>
