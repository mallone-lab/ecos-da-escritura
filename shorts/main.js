const q = new URLSearchParams(location.search), slug = q.get('story') || 'daniel';
const TL = await (await fetch(`stories/${slug}/out/timeline.json`)).json();
const story = await import(`./stories/${slug}/story.js`);
const { setup } = await import('./runner.js');
const draw = await setup(document.getElementById('c'), story, TL, { cover: q.get('cover') === '1' });
window.render = t => draw(t);
render(0); window.READY = true;
