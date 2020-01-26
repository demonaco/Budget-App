var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += sum + cur.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            Inc: []
        },
        totals: {
            exp: 0,
            inc: 0

        },
        budget: 0,
        percentage: -1
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

        deleteItem: function (type, id) {

            var ids = data.allItems[type].map(function (current) {
                return 2;

            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function () {

            //calculate total income and expenses

            calculateTotal('exp');
            calculateTotal('inc');


            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the % of income that we spend

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

            } else {
                data.percentage = -1;
            }



        },

        calculatePercentages: function () {

            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });

            return allPerc;
        },


        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage

            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

   var formatNumber = function(num,type) {
        var numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.')

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length -3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return  (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            document.querySelector(element).insertAdjacenetHTML('beforeend', newHtml)
        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el)

        },

        clearFields: function () {
            var fields, fieldsArr;

            document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            var fieldsArr = Array.prototype.slice.call(fields)

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";

            });

            fieldsArr[0].focus();

        },

        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';

            }
        },
            displayPercentages = function(percentages) {
                var fields = document.querySelectorAll(DOMstrings,expensesPercLabel);

                var nodeListForEach = function(list, callback) {
                    for (var i = 0; i < list.length; i++) {
                        callback(list[i], i);
                    }
                };

                nodeListForEach(fields, function(current, index) {
                        if (percentages[index] > 0) {
                            current.textContent = percentages[index] + '%';

                        } else {
                            current.textContent = '---';

                        }
                })

            },

            displayMonth: function() {
                var now, year, months;
                
                now = new Date()
                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                month = now.getMonth();
                
                year = now.getFullYear();
                document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
            },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();


//global app controller

var controller = (function (budgetCtrl, UICtrl) {


    var setupEventListeners = function () {


        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener("click", function (ctrlAddItem) {

            document.addEventListener('keypress', function (event) {

                if (event.keycode === 13 || event.which === 13) {
                    ctrlAddItem();
                }

            })

            document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

        });

        var updateBudget = function () {

            budgetCtrl.calculateBudget();

            var budget = budgetCtrl.getBudget();

            UICtrl.displayBudget(budget)

            console.log(budget);

        };

        var updatePercentages = function () {

            budgetCtrl.calculatePercentages();

          var percentages = budgetCtrl.getPercentages();

          console.log(percentages);

          UICtrl.displayPercentages(percentages);

        }



        var ctrlAddItem = function () {

            var input, newItem;

            input = UICtrl.getinput();

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            UICtrl.addListItem(newItem, input.type);

            UICtrl.clearFields();

            updateBudget();

            updatePercentage();

        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID;

        itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id)

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);


            UICtrl.deleteListItem(itemID);

            updateBudget();

            updatePercentage()
        }
    }

    return {
        init: function () {
            console.log("started")
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();