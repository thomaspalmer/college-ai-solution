const key = 'KEY_GO_HERE';
const apiUrl = 'https://api.openai.com/v1/chat/completions';

window.addEventListener('load', () => {
    document.querySelector('#form').addEventListener('submit', (e) => {
        e.preventDefault();
        document.querySelector('#response').innerHTML = '';
        document.querySelector('#button').disabled = true;

        (async () => {
            const inputOne = document.querySelector('#input_1');
            const inputTwo = document.querySelector('#input_2');

            const { data, status } = await axios.post(apiUrl, {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        'role': 'system',
                        'content': 'You will be supplied 2 film names. For each film name I would like a one fun fact and 1 opinion. If the films are comparible, also provide 1 comparison fact',
                    },
                    {
                        'role': 'user',
                        'content': `Film 1: ${inputOne.value}. Film 2: ${inputTwo.value}`,
                    },
                ],
            }, {
                headers: {
                    Authorization: `Bearer ${key}`
                },
            });
            
            if (status !== 200) {
                return respondToUser([
                    'Sorry, there was a problem. Please try again'
                ], 'error');
            }

            const response = data.choices
                .map(choice => choice.message.content.split("\n")?.filter((i) => i.length > 0))
                .flat();

            document.querySelector('#input_1').value = '';
            document.querySelector('#input_2').value = '';

            return respondToUser(response);
        })();
    });
});

const respondToUser = (messages, type = 'success') => {
    let classes = '';

    switch (type) {
        case 'error':
            classes = 'bg-red-50 text-red-700 border-red-100';
            break;

        default:
            classes = 'bg-green-50 text-green-700 border-green-100';
            break;
    }

    document.querySelector('#response').innerHTML = `
        <div class="${classes} w-full mb-4 border rounded-md px-4 py-2 space-y-2">
            ${messages?.map(message => `<div>${message}</div>`)?.join('')}
        </div>
    `;

    document.querySelector('#button').disabled = false;
}
