
const BASE_URL = "https://law.tau.ac.il";

let generatedHtml = "";

function cleanText(element) {
    if (!element) return "";

    return element.textContent
        .replace(/\s+/g, " ")
        .trim();
}

function parseEvents(html) {

    const parser = new DOMParser();

    const doc = parser.parseFromString(
        html,
        "text/html"
    );

    const rows = doc.querySelectorAll(
        ".views-row"
    );

    const events = [];

    rows.forEach(row => {

        const titleLink =
            row.querySelector(".title a");

        if (!titleLink) return;

        const image =
            row.querySelector("img");

        const calendarLink =
            row.querySelector(
                ".add_to_calendar a"
            );

        events.push({

            title:
                cleanText(titleLink),

            event_url:
                new URL(
                    titleLink.getAttribute("href"),
                    BASE_URL
                ).href,

            type:
                cleanText(
                    row.querySelector(".event_type")
                ),

            date:
                cleanText(
                    row.querySelector(".event_date")
                ),

            time:
                cleanText(
                    row.querySelector(".event_time")
                ),

            summary:
                cleanText(
                    row.querySelector(
                        ".body_content_event"
                    )
                ),

            registration:
                cleanText(
                    row.querySelector(
                        ".marketing-text"
                    )
                ),

            image_url:
                image?.src || "",

            calendar_url:
                calendarLink
                ? new URL(
                    calendarLink.getAttribute("href"),
                    BASE_URL
                  ).href
                : ""

        });

    });

    return events;
}

function renderEvent(event) {

    return `
<tr>
<td style="padding:8px 16px;">

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
background:#f3f8fc;
border:1px solid #d9e7f3;
border-radius:8px;">

<tr>

<td width="130"
style="padding:12px;">

<a href="${event.event_url}">
<img
src="${event.image_url}"
width="120"
style="
display:block;
border-radius:4px;">
</a>

</td>

<td style="padding:12px;">

<div style="
font-size:12px;
font-weight:bold;
color:#003366;">

${event.type}
|
${event.date}
|
${event.time}

</div>

<div style="
margin-top:6px;
font-size:18px;
font-weight:bold;">

<a
href="${event.event_url}"
style="
text-decoration:none;
color:#222;">

${event.title}

</a>

</div>

${
event.summary
?
`<div style="
margin-top:8px;
font-size:13px;
color:#666;">
${event.summary}
</div>`
:
""
}

${
event.registration
?
`<div style="
margin-top:6px;
font-size:13px;
font-weight:bold;
color:#003366;">
${event.registration}
</div>`
:
""
}

</td>

</tr>

</table>

</td>
</tr>
`;
}

function generateNewsletter(events) {

    const rows =
        events
        .map(renderEvent)
        .join("");

    return `
<!DOCTYPE html>
<html dir="rtl">
<body style="
background:#f5f5f5;
padding:20px;
font-family:Arial,sans-serif;">

<table
width="600"
align="center"
cellpadding="0"
cellspacing="0"
style="
background:white;
border:1px solid #ddd;">

<tr>
<td style="
padding:25px;
border-bottom:3px solid #003366;">

<h2 style="
margin:0;
color:#003366;">
אירועים קרובים
</h2>

<div style="
margin-top:8px;
color:#666;">
ניוזלטר שבועי
</div>

</td>
</tr>

${rows}

</table>

</body>
</html>
`;
}

document
.getElementById("generateBtn")
.addEventListener("click", () => {

    const source =
        document
        .getElementById("sourceHtml")
        .value;

    const events =
        parseEvents(source);

    generatedHtml =
        generateNewsletter(events);

    document
        .getElementById("previewFrame")
        .srcdoc =
        generatedHtml;
});

document
.getElementById("copyBtn")
.addEventListener("click", async () => {

    await navigator.clipboard.writeText(
        generatedHtml
    );

    alert("HTML copied.");
});

document
.getElementById("downloadBtn")
.addEventListener("click", () => {

    const blob =
        new Blob(
            [generatedHtml],
            { type: "text/html" }
        );

    const a =
        document.createElement("a");

    a.href =
        URL.createObjectURL(blob);

    a.download =
        "newsletter.html";

    a.click();
});

