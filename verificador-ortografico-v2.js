(function () {
    const listOfFinalElements = ["div", "button", "a", "h1", "h2", "h3", "h4", "h5", "span", "p"];

    const checkElements = (element) => {
        //console.log(`Element ${element.nodeName.toLowerCase()}`)

        switch (element.nodeName.toLowerCase()) {
            case "div":
                if (element.childElementCount <= 0)
                    verifyorthography(element);
                break;

            default:
                verifyorthography(element);
                break;
        }
    }

    const verifyorthography = (element) => {
        if (element.innerText) {
            var text = element.innerText.trim();
            if (text) {
                //console.log(`Verificar ortográfia: ${text}`, element)
                textChecker(text, element);
            }
        }
    }

    const textChecker = (text, element) => {
        var myHeaders = new Headers();
        myHeaders.append("accept-language", "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7");
        myHeaders.append("content-type", "application/x-www-form-urlencoded; charset=UTF-8");

        var raw = `disabledRules=WHITESPACE_RULE&allowIncompleteResults=true&text=${encodeURI(text)}&language=pt-BR`;

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://textchecker.7graus.com/v2/check", requestOptions)
            .then(response => response.json())
            .then(result => {
                //console.log(result)
                //console.log(result.matches)

                if (result.matches && result.matches.length > 0) {
                    for (const match of result.matches) {
                        //console.log(match.rule.id, match)

                        switch (match.rule.id) {
                            case "HUNSPELL_RULE":
                                element.style.backgroundColor = "#FFF700";
                                element.style.color = "#ff0000";
                                break;

                            case "BARBARISMS":
                            case "PT_BARBARISMS_REPLACE":
                                element.style.backgroundColor = "9EFF00";
                                element.style.color = "magenta";
                                break;

                            default:
                                break;
                        }
                    }
                }
            })
            .catch(error => console.log('Erro na consulta do text checker', error));
    }



    const getWords = () => {
        for (const item of listOfFinalElements) {

            var elements = document.querySelectorAll(item);

            for (const parentElement of elements) {
                checkElements(parentElement);
            }
        }
    }

    console.log("Verificador iniciado!");

    getWords();
})();