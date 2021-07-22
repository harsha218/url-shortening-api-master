let loading = false;

window.onload = () => {
    let ip = $('#inputField')

    ip.on('keydown', (e) => {
        $('#errorMsg').toggle(false);
        if (e.which === 13 && loading === false) {
            makeRequest();
        }
    })

    makeBlocks();

    addCopyEventListener();
}

const makeBlocks = () => {
    for(let i=0; i< localStorage.length; i++) {
        let url = localStorage.key(i);
        addBlock(url, localStorage.getItem(url));
    }
}

const addCopyEventListener = () => {
    $('.copy').click(function () {
        $('.copy').text('Copy');
        $(this).text('Copied!');
        let stLink = $(this).parent().children()[0].innerText;
        ultralightCopy(stLink);
    })
}

const addBlock = (url, stLink) => {
    let ele = `<div class="output">
                    <div class="left">${url}</div>
                    <div class="right">
                        <div>${stLink}</div>
                        <span class='button copy'>Copy</span>
                    </div>
                </div>`

    $(".outputContainer > div:nth-child(1)").after(ele);

    localStorage.setItem(url, stLink);
    addCopyEventListener();
}

const makeRequest = async () => {
    let url = $('#inputField').val().trim();

    if (url == '') {
        $('#errorMsg').toggle();
        return;
    } else if (localStorage.getItem(url) != null) {
        addBlock(url, localStorage.getItem(url));
        return;
    }

    let btn = $('#submitBtn').first()

    $('#loader').toggle();
    btn.text('Loading...')
    btn.addClass("disabled")

    let response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)

    if (response.ok) {
        let json = await response.json();
        let stLink = json.result.full_short_link;
        console.log(stLink);

        addBlock(url, stLink);

        $('#loader').hide();
        btn.text('Shorten It!')
        btn.removeClass("disabled")

    } else {
        alert("Invalid URL");

        $('#loader').hide();
        btn.text('Shorten It!')
        btn.removeClass("disabled")
    }
}
