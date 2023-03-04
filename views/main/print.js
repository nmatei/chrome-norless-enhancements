function getDocTitle() {
  return new Date().toISOString().split("T")[0] + "-Songs";
}

function saveAsHTML(target) {
  const docTitle = getDocTitle();
  const html = getPlaylistDoc(target);
  download(html, docTitle + ".html", "text/plain");
}

async function copyPlaylist(target) {
  // TODO not best solution yet
  //  when have <span class="text"></span> inside
  //  - try to render html inside iframe and read text from there
  //const body = mapBody(target, '');
  const html = getPlaylistDoc(target, "# ");
  const body = await getInnerToClipboard(html);
  copyToClipboard(body);
}

function getPlaylistDoc(target, titlePrefix = "") {
  const docTitle = getDocTitle();
  const body = mapBody(target, "<br />", titlePrefix);
  return getPrintPage(body, docTitle);
}

function mapBody(target, nl = "<br />", titlePrefix = "") {
  const songs = getSongsEntries(target);
  let body = Object.values(songs)
    .map(e => ({
      title: e.title,
      slides: e.slides ? e.slides.map(s => s.text.replaceAll("\n", `${nl}\n`)).join(`${nl}${nl}\n\n`) : ""
    }))
    .map(c => `<h1>${titlePrefix}${c.title}</h1>\n${c.slides}`)
    .join(`${nl}${nl}\n\n`);

  body = body.replaceAll(`<span class="final">*</span>`, ``);

  return body;
}

function getPrintPage(body, docTitle) {
  return `<html>
  <head>
	<title>${docTitle}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<style>
	  body { 
	    padding: 10px;
	    font-size: 1.7em;
	    background: #fff;
	    color: #000;
	  }
	  h1 {
	    margin: 5px 2px;
	    font-size: 1.3em;
	    color: #00217e;
	  }
	  .chord {
		  display: none;
	  }
	</style>
  </head>
  <body>
	  ${body}
  </body>
  </html>`;
}
