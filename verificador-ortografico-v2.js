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
            var text = element.innerText.trim().replace(/['"]+/g, '');
            if (text) {
                //console.log(`Verificar ortográfia: ${text}`, element)
                //textChecker(text, element);
                elementChecker(text, element);
            }
        }
    }

    const textCheckerService = (text) => {
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

        return fetch("https://textchecker.7graus.com/v2/check", requestOptions)
            .then(response => response.json())
            .then(result => {

                var textCheckerResult = {
                    type: "success",
                    rule: null,
                    sentence: null,
                };

                // console.log("Result", result);

                if (result.matches && result.matches.length > 0) {
                    for (const match of result.matches) {

                        textCheckerResult.rule = match.rule.id;
                        textCheckerResult.sentence = match.sentence;

                        switch (match.rule.id) {
                            case "HUNSPELL_RULE":
                                textCheckerResult.type = "error";
                                break;

                            case "BARBARISMS":
                            case "PT_BARBARISMS_REPLACE":
                                textCheckerResult.type = "warn";
                                break;

                            default:
                                break;
                        }
                    }
                }

                return textCheckerResult;
            })
            .catch(error => console.log('Erro na consulta do text checker', error));
    }

    const isSentenceElement = (element) => {
        switch (element.nodeName.toLowerCase()) {
            case "div":
            case "p":
            case "span":
            case "a":
                return true;

            default:
                return false;
        }
    }

    const elementChecker = async (sentence, element) => {

        

        var resultChecker = await textCheckerService(sentence);

        if (resultChecker) {

            switch (resultChecker.type) {
                case "error":
                    //console.log("Checker", resultChecker);

                    const words = resultChecker.sentence?.trim()?.split(" ");

                    //console.log("Verify", {sentence: resultChecker.sentence, words: words, isSentenceElement: isSentenceElement(element)})

                    if (words.length > 1 && isSentenceElement(element)) {

                        for (const word of words) {

                            var resultCheckerWord = await textCheckerService(word);

                            //console.log("CheckerWord", resultCheckerWord);
                            if (resultCheckerWord.type === "error") {

                                //var elementType = element.nodeName.toLowerCase();

                                var nodeElement = document.createElement('span');
                                nodeElement.style.backgroundColor = "#FFF700";
                                nodeElement.style.color = "#ff0000";
                                nodeElement.innerText = word;

                                console.log("nodeElement", nodeElement.outerHTML); 

                                var html = element.innerHTML;

                                 var html = html.replace(word.trim(), nodeElement.outerHTML);

                                 console.log("elementHtml", html); 
                                 element.innerHTML = html;
                            }

                        }

                    } else {
                        element.style.backgroundColor = "#FFF700";
                        element.style.color = "#ff0000";
                    }

                    break;

                case "warn":

                    element.style.backgroundColor = "#9EFF00";
                    element.style.color = "magenta";

                    break;

                default:
                    break;
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
                                element.style.backgroundColor = "#9EFF00";
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