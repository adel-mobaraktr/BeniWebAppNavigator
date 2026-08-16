// Web_Navigator_App - Data Engine

let Data = {};


function buildData(dataSource) {

    Data = {};

    if (!dataSource || typeof dataSource !== "object") {
        console.error("Invalid application data.");
        return;
    }

    Object.keys(dataSource).forEach(key => {

        Data[key] = dataSource[key];

    });

    console.log("Data Engine initialized.");
    console.log("Data:", Data);
}




function getAll(dataSetName) {

    if (!Data[dataSetName]) {
        console.warn(`Data set not found: ${dataSetName}`);
        return [];
    }

    return Data[dataSetName];
}





function getById(dataSetName, id, idField) {

    const records = getAll(dataSetName);

    if (records.length === 0) {
        return null;
    }

    if (!idField) {

        const firstRecord = records[0];

        const idFields = Object.keys(firstRecord).filter(
            key => key.endsWith("_ID")
        );

        const singularName =
            dataSetName.endsWith("ies")
                ? dataSetName.slice(0, -3) + "y"
                : dataSetName.endsWith("s")
                    ? dataSetName.slice(0, -1)
                    : dataSetName;

        idField = idFields.find(
            key =>
                key.toLowerCase() ===
                (singularName + "_ID").toLowerCase()
        );

        if (!idField && idFields.length === 1) {
            idField = idFields[0];
        }

    }

    if (!idField) {

        console.warn(
            `ID field could not be determined for data set: ${dataSetName}`
        );

        return null;
    }

    return records.find(
        record => record[idField] == id
    ) || null;
}




function filterData(dataSetName, condition) {

    const records = getAll(dataSetName);

    if (typeof condition !== "function") {
        console.warn("Filter condition must be a function.");
        return [];
    }

    return records.filter(condition);
}






function searchData(dataSetName, searchText, fields) {

    const records = getAll(dataSetName);

    if (!searchText) {
        return records;
    }

    const text = String(searchText).toLowerCase();

    if (!Array.isArray(fields) || fields.length === 0) {
        fields = Object.keys(records[0] || {});
    }

    return records.filter(record => {

        return fields.some(field => {

            const value = record[field];

            return value !== null &&
                   value !== undefined &&
                   String(value).toLowerCase().includes(text);

        });

    });
}


console.log("Data Access Layer initialized.");




function getRelated(dataSetName, foreignKeyField, foreignKeyValue) {

    const records = getAll(dataSetName);

    return records.filter(
        record => record[foreignKeyField] == foreignKeyValue
    );
}


console.log("Relationship Engine initialized.");
