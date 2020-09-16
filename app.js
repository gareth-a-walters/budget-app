//BUDGET CONTROLLER
let budgetController = (function(){

    //income function constructor
    let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //expense function constructor
    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    //data object
    let data = {
        allItems: {
            exp: [],
            inc: [], 
        }, 
        totals: {
            exp: 0,
            inc: 0
        }, 
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val){
            let newItem, ID;

            //create new item 
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //create new item based on inc or exp type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val)
            }
            
            //push into data structure 
            data.allItems[type].push(newItem);

            //return new element
            return newItem;
        },

        calculateBudget: function(){

            //Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate the budget (income - expenses)
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate the percentage of income spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    };

})();

//UI CONTROLLER 
let UIController = (function(){

    let DOMstrings = {
        inputType: '.add__type', 
        inputDescription: '.add__description', 
        inputValue: '.add__value', 
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, //either exp or inc
                description: document.querySelector(DOMstrings.inputDescription).value, 
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type){
            let html, newHTML, element;

            //Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            };

            //Replace placeholder text with actual data 
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            //Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },

        clearFields: function(){
            let fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array){
                current.value = '';
            });
            fieldsArr[0].focus();
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    };
})();

//GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl){

    let setupEventListeners = function(){
        let DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                event.preventDefault(); // prevents the enter key from also triggering a click event
                ctrlAddItem();
            }
        });
    };

    let updateBudget = function(){

        //Calculate the budget
        budgetCtrl.calculateBudget();

        //Return the budget
        let budget = budgetCtrl.getBudget();

        //Display the budget on the UI
        console.log(budget);
    };

    let ctrlAddItem = function(){
        let input, newItem;

        //Get field input data
        input = UICtrl.getInput();

        if(input.description !== '' && !isNaN(input.value) && input.value > 0){
            //Add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //Add item to UI
            UICtrl.addListItem(newItem, input.type);

            //Clear fields
            UICtrl.clearFields();

            //Calculate and update budget
            updateBudget();
        } 
    };

    return {
        init: function(){
            console.log('Application has started.');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();