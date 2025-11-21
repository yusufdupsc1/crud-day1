const textInput = document.getElementById('textInput');
const submitBtn = document.getElementById('submitBtn');

submitBtn.addEventListener('click', function() {
    const inputData = textInput.value;
    console.log(inputData);
});
