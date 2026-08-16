let appData = null;
let appConfig = null;


let Navigation = {

    currentCategoryId: null,

    searchText: "",

    view: "categories"

};


function setNavigationState(
    view,
    categoryId = null,
    searchText = ""
) {

    Navigation.view =
        view;

    Navigation.currentCategoryId =
        categoryId;

    Navigation.searchText =
        searchText;

    console.log(
        "Navigation State:",
        Navigation
    );

}


function clearNavigationState() {

    setNavigationState(
        "categories",
        null,
        ""
    );

}


async function loadApplicationData() {

    try {

        console.log(
            "Loading application data..."
        );


        const appStatus =
            document.getElementById(
                "appStatus"
            );


        if (appStatus) {

            appStatus.textContent =
                "Loading...";

        }


        const [
            dataResponse,
            configResponse
        ] = await Promise.all([

            fetch(
                "../02_JSON/webApp_Data.json"
            ),

            fetch(
                "../02_JSON/webApp_Config.json"
            )

        ]);


        if (!dataResponse.ok) {

            throw new Error(
                "Unable to load webApp_Data.json"
            );

        }


        if (!configResponse.ok) {

            throw new Error(
                "Unable to load webApp_Config.json"
            );

        }


        appData =
            await dataResponse.json();

        buildData(
            appData
        );


        appConfig =
            await configResponse.json();

        buildConfig(
            appConfig
        );


        /*
         * Configuration is now available.
         *
         * From this point forward we can
         * safely use Labels, Messages,
         * Themes and Features.
         */


        applyTheme();


        initializeApplication();


        renderCategories();


    }

    catch (error) {

        console.error(
            "Application loading error:",
            error
        );


        const appStatus =
            document.getElementById(
                "appStatus"
            );


        if (appStatus) {

            appStatus.textContent =
                getMessage(
                    "Unexpected_Error"
                );

        }

    }

}


function initializeApplication() {

    /*
     * Application Name
     */

    const appName =
        Config.Settings.App_Name;


    const appTitle =
        document.getElementById(
            "appTitle"
        );


    if (appTitle) {

        appTitle.textContent =
            appName;

    }


    /*
     * Search Placeholder
     *
     * TEST ONLY
     *
     * We deliberately keep Searchkkk
     * until the Search Label issue
     * is completely finished.
     */

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (searchInput) {

        searchInput.placeholder =
            getLabel(
                "Searchkkk"
            );

    }


    /*
     * Application Status
     *
     * Now controlled by the
     * Messages Engine.
     */

    const appStatus =
        document.getElementById(
            "appStatus"
        );


    if (appStatus) {

        appStatus.textContent =
            getMessage(
                "Data_Loaded"
            );

    }


    /*
     * Initialize application
     * functionality.
     */

    initializeSearch();

    initializeBackButton();

}


function initializeSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            const searchText =
                searchInput.value
                    .trim()
                    .toLowerCase();


            /*
             * Search cleared
             */

            if (!searchText) {

                const selectedCategory =
                    document.querySelector(
                        "#categoryList button.selected"
                    );


                if (selectedCategory) {

                    const categoryId =
                        Number(
                            selectedCategory.dataset.categoryId
                        );


                    setNavigationState(
                        "category-items",
                        categoryId,
                        ""
                    );


                    renderItemsByCategory(
                        categoryId
                    );

                }

                else {

                    clearNavigationState();


                    const itemList =
                        document.getElementById(
                            "itemList"
                        );


                    if (itemList) {

                        itemList.innerHTML =
                            "";

                    }


                    const itemTitle =
                        document.getElementById(
                            "itemTitle"
                        );


                    if (itemTitle) {

                        itemTitle.textContent =
                            "";

                    }

                }


                return;

            }


            /*
             * Determine which Items
             * should be searched.
             */

            let items;


            if (
                Navigation.currentCategoryId !==
                null
            ) {

                items =
                    getRelated(
                        "Items",
                        "Item_Category_ID",
                        Navigation.currentCategoryId
                    );

            }

            else {

                items =
                    getAll(
                        "Items"
                    );

            }


            /*
             * Search Item Name
             * and Item Description.
             */

            const results =
                items.filter(
                    item => {

                        const itemName =
                            String(
                                item.Item_Name || ""
                            ).toLowerCase();


                        const itemDescription =
                            String(
                                item.Item_Description || ""
                            ).toLowerCase();


                        return (

                            itemName.includes(
                                searchText
                            )

                            ||

                            itemDescription.includes(
                                searchText
                            )

                        );

                    }
                );


            /*
             * Update navigation state.
             */

            setNavigationState(
                "search",
                Navigation.currentCategoryId,
                searchText
            );


            /*
             * Display search results.
             */

            renderSearchResults(
                results
            );

        }
    );

}


function updateBackButton() {

    const backButton =
        document.getElementById(
            "backButton"
        );


    if (!backButton) {

        return;

    }


    if (
        Navigation.currentCategoryId !==
        null
    ) {

        backButton.style.display =
            "block";

    }

    else {

        backButton.style.display =
            "none";

    }

}


function initializeBackButton() {

    const backButton =
        document.getElementById(
            "backButton"
        );


    if (!backButton) {

        return;

    }


    backButton.addEventListener(
        "click",
        function () {

            const itemList =
                document.getElementById(
                    "itemList"
                );


            const itemTitle =
                document.getElementById(
                    "itemTitle"
                );


            const searchInput =
                document.getElementById(
                    "searchInput"
                );


            /*
             * Clear Search.
             */

            if (searchInput) {

                searchInput.value =
                    "";

            }


            /*
             * Clear navigation.
             */

            clearNavigationState();


            updateBackButton();


            /*
             * Clear Items.
             */

            if (itemList) {

                itemList.innerHTML =
                    "";

            }


            /*
             * Clear Item Title.
             */

            if (itemTitle) {

                itemTitle.textContent =
                    "";

            }


            /*
             * Remove selected
             * Category.
             */

            document
                .querySelectorAll(
                    "#categoryList button"
                )
                .forEach(
                    button => {

                        button.classList.remove(
                            "selected"
                        );

                    }
                );

        }
    );

}


function createItemElement(item) {

    const itemElement =
        document.createElement(
            "button"
        );


    itemElement.dataset.itemId =
        item.Item_ID;


    const itemName =
        document.createElement(
            "span"
        );


    itemName.className =
        "item-name";


    itemName.textContent =
        item.Item_Name;


    const itemDescription =
        document.createElement(
            "span"
        );


    itemDescription.className =
        "item-description";


    itemDescription.textContent =
        item.Item_Description || "";


    const itemArrow =
        document.createElement(
            "span"
        );


    itemArrow.className =
        "item-arrow";


    itemArrow.textContent =
        "→";


    itemElement.appendChild(
        itemName
    );


    itemElement.appendChild(
        itemDescription
    );


    itemElement.appendChild(
        itemArrow
    );


    itemElement.addEventListener(
        "click",
        function () {

            window.open(
                item.ItemLink_URL,
                "_blank"
            );

        }
    );


    return itemElement;

}


function renderSearchResults(items) {

    const itemList =
        document.getElementById(
            "itemList"
        );


    const backButton =
        document.getElementById(
            "backButton"
        );


    if (backButton) {

        backButton.style.display =
            "block";

    }


    if (!itemList) {

        return;

    }


    itemList.innerHTML =
        "";


    items.forEach(
        item => {

            const itemElement =
                createItemElement(
                    item
                );


            itemList.appendChild(
                itemElement
            );

        }
    );

}


function renderCategories() {

    const categoryList =
        document.getElementById(
            "categoryList"
        );


    if (!categoryList) {

        return;

    }


    const categories =
        getAll(
            "Categories"
        );


    categoryList.innerHTML =
        "";


    categories.forEach(
        category => {

            const categoryElement =
                document.createElement(
                    "button"
                );


            categoryElement.textContent =
                category.Category_Name;


            categoryElement.dataset.categoryId =
                category.Category_ID;


            categoryElement.addEventListener(
                "click",
                function () {

                    /*
                     * Remove previous
                     * selection.
                     */

                    document
                        .querySelectorAll(
                            "#categoryList button"
                        )
                        .forEach(
                            button => {

                                button.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    /*
                     * Select current
                     * Category.
                     */

                    categoryElement.classList.add(
                        "selected"
                    );


                    /*
                     * Update navigation.
                     */

                    setNavigationState(
                        "category-items",
                        category.Category_ID
                    );


                    updateBackButton();


                    /*
                     * Display Items.
                     */

                    renderItemsByCategory(
                        category.Category_ID
                    );

                }
            );


            categoryList.appendChild(
                categoryElement
            );

        }
    );

}


function renderItemsByCategory(
    categoryId
) {

    const itemList =
        document.getElementById(
            "itemList"
        );


    if (!itemList) {

        return;

    }


    const items =
        getRelated(
            "Items",
            "Item_Category_ID",
            categoryId
        );


    const category =
        getById(
            "Categories",
            categoryId
        );


    const itemTitle =
        document.getElementById(
            "itemTitle"
        );


    if (itemTitle) {

        itemTitle.textContent =
            category
                ? category.Category_Name
                : "";

    }


    itemList.innerHTML =
        "";


    items.forEach(
        item => {

            const itemElement =
                createItemElement(
                    item
                );


            itemList.appendChild(
                itemElement
            );

        }
    );

}


function getSetting(key) {

    if (
        !appConfig ||
        !appConfig.Settings
    ) {

        return null;

    }


    const setting =
        appConfig.Settings.find(
            item =>
                item.Setting_Key === key
        );


    return setting
        ? setting.Setting_Value
        : null;

}


loadApplicationData();
