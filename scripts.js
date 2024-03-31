// Selecting DOM elements
const cpfInput = document.querySelector('.cpf');
const submitButton = document.querySelector('.enviar');


// Adding an event listener to format CPF visually while the user types
cpfInput.addEventListener('input', function() {
    let formattedCPF = cpfInput.value;
    
    // Remove all non-numeric characters
    formattedCPF = formattedCPF.replace(/\D/g, '');

    // Insert dots visually every three digits
    if (formattedCPF.length > 3) {
        formattedCPF = formattedCPF.substring(0, 3) + '.' + formattedCPF.substring(3);
    }
    if (formattedCPF.length > 7) {
        formattedCPF = formattedCPF.substring(0, 7) + '.' + formattedCPF.substring(7);
    }
    if (formattedCPF.length > 11) {
        formattedCPF = formattedCPF.substring(0, 11) + '-' + formattedCPF.substring(11);
    }

    // Update the CPF input field value
    cpfInput.value = formattedCPF;
});



// Adding event listener for CPF submission
submitButton.addEventListener('click', function () {
    // Cleaning input CPF and converting it into an array
    const cleanedCPFArray = cleanCPF(cpfInput.value);
    
    // Initial validation of CPF
    const isCPFValid = initialValidation(cleanedCPFArray);
    
    if (!isCPFValid) {
        // Alerting if CPF is invalid
        showAlert('CPF inválido', false);
    } else {
        // Calculating first verification digit
        const cpfCalculator = new CPFCalculator(cleanedCPFArray.slice(0, -2));
        cpfCalculator.calculate(10);
    }
});

// Initial validation function
function initialValidation(array) {
    if (array.length !== 11) {
        return false;
    } else {
        // Checking if all digits are the same
        const firstDigit = array[0];
        for (let i = 1; i < array.length; i++) {
            if (array[i] !== firstDigit) {
                return true;
            }
        }
        return false;
    }
}

// Cleaning CPF function
function cleanCPF(cpf) {
    let cleanedCPF = cpf.replace(/\D+/g, ''); // Removes all non-digit characters
    let cpfArray = Array.from(cleanedCPF);
    return cpfArray.map(digit => parseInt(digit));
}

// CPF calculator constructor function
function CPFCalculator(cpfdigit) {
    this.cpfdigit = cpfdigit;
}

// Prototype method for CPFCalculator to calculate CPF
CPFCalculator.prototype.calculate = function (counter) {
    let sumList = [];
    this.cpfdigit.forEach(function (value) {
        let multiplied = counter * value;
        counter = counter - 1;
        sumList.push(multiplied);
    });
    const sum = sumList.reduce(function (accumulator, value) {
        accumulator = accumulator + value;
        return accumulator;
    }, 0);
    firstDigitCalculation(sum, this.cpfdigit);
};

// Function to calculate the first verification digit of the CPF
function firstDigitCalculation(sum, array) {
    let digit = 11 - (sum % 11);
    if (digit > 9) {
        digit = 0;
    }
    array.push(digit);
    if (array.length < 11) {
        const cpfCalculator2 = new CPFTenDigitCalculator(array);
        cpfCalculator2.calculate(11);
    } else {
        validateCPF(array);
    }
}

// Constructor function to calculate CPF with ten digits
function CPFTenDigitCalculator(cpfdigit) {
    CPFCalculator.call(this, cpfdigit);
}

// Setting up the prototype chain correctly
CPFTenDigitCalculator.prototype = Object.create(CPFCalculator.prototype);
CPFTenDigitCalculator.prototype.constructor = CPFTenDigitCalculator;

// Function to validate the calculated CPF
function validateCPF(createdArray) {
    const enteredCPF = cleanCPF(cpfInput.value);
    const enteredNumber = parseInt(enteredCPF.join(''));
    const createdNumber = parseInt(createdArray.join(''));
    if (enteredNumber === createdNumber) {
        showAlert('CPF válido', true);
    } else {
        showAlert('CPF inválido', false);
    }
}

// Function to display alert message
function showAlert(message, isValid) {
    const resultElement = document.querySelector('.result');
    resultElement.innerHTML = '';
    const paragraph = createParagraph();
    if (isValid === true) {
        paragraph.classList.add('ok');
    } else {
        paragraph.classList.add('erro');
    }
    paragraph.innerHTML = message;
    resultElement.appendChild(paragraph);
}

// Function to create paragraph element
function createParagraph() {
    return document.createElement('p');
}