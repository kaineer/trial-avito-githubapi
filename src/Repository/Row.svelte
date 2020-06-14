<script>
  import Row from '../Table/Row.svelte';
  import Cell from '../Table/Cell.svelte';

  const TitleWidth = 150;
  const DescrWidth = 450;

  export let title;
</script>


<Row>
  <Cell width={TitleWidth} align="right">{title}</Cell>
    <Cell width={DescrWidth}>
      <slot></slot>
    </Cell>
</Row>

