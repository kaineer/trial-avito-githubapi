<script>
  export let width;
  export let align = 'left';
</script>

<div style="width: {width}px; text-align: {align};">
  <slot></slot>
</div>

<style>
  div {
    font-size: 19pt;
    padding: 8px;
    display: inline-block;

    overflow: hidden;
    text-overflow: ellipsis;

    vertical-align: top;
  }
</style>
