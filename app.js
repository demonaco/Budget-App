var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += sum + cur.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems = {
            exp: [],
            Inc: []
        },
        totals: {
            exp: 0,
            inc: 0

        }

    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //create new ID

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //create new item based on 'inc' or 'exp' type
            if (type === "exp") {
                newItem = new Expense(ID, des, val);

            } else if (type === "inc") {
                newItem = new Income(ID, des, val);

            }
            //push it into our data structure   
            data.allItems[type].push(newItem);
            //return new element
            return newItem;
        },

        calculateBudget: function(){

            //calculate total income and expenses
             
            calculateTotal('exp');
            calculateTotal('inc');


            //calculate the budget: income - expenses
            

            //calculate the % of income that we spend

        },

        testing: function () {
            console.log(data);
        }
    }


})();



var UIController = (function () {

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }

    return {
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }

        }, 

        addListItem: function (obj, type) {
                var html;
 
                if (type === 'inc') {
                    element == DOMstrings.incomeContainer;

            html = '<div class="item clearfix" id="income_%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"> </i></button> </div> </div> </div>';
                } else if (type === 'exp') {
                    element = DOMstrings.expensesContainer;

           html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"> </i> </button> </div> </div> </div>';
        }

        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value); 

            document.querySelector(element).insertAdjacenetHTML('beforeend', newHtml)
    },

        clearFields: function(){
            var fields, fieldsArr;

             document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
        
             var fieldsArr = Array.prototype.slice.call(fields)

             fieldsArr.forEach(function(current, index, array) {
                 current.value = "";

             });

             fieldsArr[0].focus();
        
            },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();


//global app controller

var controller = (function (budgetCtrl, UICtrl) {


    var setupEventListeners = function () {


        var DOM = UICtrl.getDOMstrings

        document.querySelector(DOM.inputBtn).addEventListener("click", function (ctrlAddItem) {

            document.addEventListener('keypress', function (event) {

                if (event.keycode === 13 || event.which === 13) {
                    ctrlAddItem();
                }

            })

        });


        var ctrlAddItem = function () {

            input = UICtrl.getinput();

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

                UICtrl.addListItem(newItem, input.type);

                UICtrl.clearFields();

        }
    };

    return {
        init: function () {
            console.log("started")
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();