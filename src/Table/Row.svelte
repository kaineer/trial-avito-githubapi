<script>
  export let thead;
</script>

<div class="row {thead ? 'row-head' : ''}">
  <slot></slot>
</div>

<style>
  .row {
    border: solid 1px #747474;
    border-radius: 6px;
    box-shadow: 3px 3px 4px #747474;

    margin-bottom: 8px;

    text-align: left;
  }
  .row-head {
    background-color: #A5AAE1;
  }
</style>
