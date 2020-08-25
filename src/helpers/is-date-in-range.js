module.exports = {
    /*
        Verifica se a data de hoje está dentro do limite entre 'initialDate' e
        'daysFromInitialDate' dias após initialDate
    */
    isDateInRange: (initialDate, daysFromInitialDate) => {
        if (!(initialDate instanceof Date)) {
            return false;
        }

        const minDate = initialDate;
        const maxDate = new Date(
            minDate.getTime() + daysFromInitialDate * 86400000
        );
        const currentDate = new Date();

        return currentDate >= minDate && currentDate < maxDate;
    },
};
