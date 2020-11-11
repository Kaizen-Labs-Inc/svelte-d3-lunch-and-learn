<script>
    export let aircraft;

</script>
<style>
    .row {
        margin-top: 4px;
        margin-bottom: 4px;
    }
    .row:hover {
        cursor: pointer;
    }
    .highlight {
        background-color: #123456;
        color: white;
    }
</style>
<div class="row highlight">
    <div>{aircraft.Airplane}</div>
    <div>Seats: {aircraft.Seats}</div>
    <div>SMPG: {aircraft.SMPG}</div>
</div>