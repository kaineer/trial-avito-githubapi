<script>
  import Row from '../Table/Row.svelte';
  import Cell from '../Table/Cell.svelte';
  import {
    NameWidth,
    StarsWidth,
    DateWidth,
    LinkWidth,
  } from '../Repository/Table';
</script>

<Row thead={true}>
  <Cell width={NameWidth}>Name</Cell>
  <Cell width={StarsWidth}>Stars</Cell>
  <Cell width={DateWidth}>Updated</Cell>
  <Cell width={LinkWidth}>Link</Cell>
</Row>
