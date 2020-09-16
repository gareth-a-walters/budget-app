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

    //data object
    let data = {
        allItems: {
            exp: [],
            inc: [], 
        }, 
        totals: {
            exp: 0,
            inc: 0
        }
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
                value: document.querySelector(DOMstrings.inputValue).value
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

    let ctrlAddItem = function(){
        let input, newItem;

        //1. Get field input data
        input = UICtrl.getInput();

        //2. Add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. Add item to UI
        UICtrl.addListItem(newItem, input.type);

        //4. Calcualte the budget

        //5. Display budget on UI

    };

    return {
        init: function(){
            console.log('Application has started.');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();