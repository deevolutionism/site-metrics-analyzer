<script>
  import { onMount } from 'svelte';
  import { createWebSocketStore } from '../websocketStore.js';
  let url = '';
  let reportUrl = '';
  let isLoading = false;
  let queue = '';

  let wsUrl;
  let wsStore;

  onMount(() => {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl = `${protocol}//${location.hostname}:3000`;
    wsStore = createWebSocketStore(wsUrl);
		wsStore.subscribe(msg => console.log(msg))
	})

  function analyze(e) {
    e.preventDefault();
    wsStore.send({ type: 'analyze', url });
  }

</script>

<h1>Lighthouse Analyzer</h1>
<form on:submit={analyze}>
  <label for="url">Enter URL:</label>
  <input type="url" bind:value={url} required />
  <button type="submit">Analyze</button>
</form>
{#if queue}
  <p>Job ID in Queue: {queue}</p>
{/if}
{#if reportUrl}
  <h2>Lighthouse Report:</h2>
  <iframe src={reportUrl} title="lighthouse report" style="width: 100%; height: 80vh; border: none;"></iframe>
{/if}
{#if isLoading}
  <p>Analysis in progress...</p>
{/if}
