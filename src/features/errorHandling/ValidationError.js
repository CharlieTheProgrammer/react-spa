/**
 * This class is used for wrapping errors coming from lower layers.
 */
class ValidationError extends Error {
    constructor(...args) {
        super(...args)  // This doesn't help TS with code descriptions
        let [ajvError] = [...args]
        // For some odd reason this.constructor.name prints "ValidationError"
        // when debugging, but actually assigns "Error during runtime.
        // This could be a babel bug or misconfig as _this.constructor.name is "Error"
        this.name = "ValidationError"
        this.origin = ajvError

        Error.captureStackTrace(this, ValidationError)
    }
}

// Format violation. These differ from Regex in that those would be manually
// defined by me in the schema vs predefined formats provided by AJV
class FormatViolation extends ValidationError {
    constructor(...args) {
        super(...args)

        if (this.origin.dataPath) {
            var dataPointName = this.origin.dataPath
            // Removing the . from the front of the AJV error, converting capitalized letters to lowercase and prepending with a space, and capitalizing the first letter
            dataPointName = dataPointName.slice(1, 2).charAt(0).toUpperCase() + dataPointName.slice(2).replace(new RegExp('([A-Z])', 'g'), ' $1').toLowerCase()
        } else {
            var dataPointName =  this.origin.parentSchema.title
        }

        this.message = `${dataPointName} is invalid.`
    }
}

// Regex violations
class PatternViolation extends ValidationError {
    constructor(...args) {
        super(...args)

        if (this.origin.dataPath) {
            var dataPointName = this.origin.dataPath
            // Removing the . from the front of the AJV error, converting capitalized letters to lowercase and prepending with a space, and capitalizing the first letter
            dataPointName = dataPointName.slice(1, 2).charAt(0).toUpperCase() + dataPointName.slice(2).replace(new RegExp('([A-Z])', 'g'), ' $1').toLowerCase()
        } else {
            var dataPointName =  this.origin.parentSchema.title
        }

        this.message = `${dataPointName} is invalid.`
    }
}

// Required violations for missing properties
class RequiredViolation extends ValidationError {
    constructor(...args) {
        super(...args)

        let dataPointName = this.origin.params.missingProperty
        // Removing the underscore from the AJV error and capitalizing the first letter
        dataPointName = dataPointName.charAt(0).toUpperCase() + dataPointName.slice(1).replace(new RegExp('([A-Z])', 'g'), ' $1').toLowerCase()
        this.message = `${dataPointName} is required.`
    }
}

// Character length violations
class LengthViolation extends ValidationError {
    constructor(...args) {
        super(...args)

        if (this.origin.dataPath) {
            var dataPointName = this.origin.dataPath
            // Removing the . from the front of the AJV error, converting capitalized letters to lowercase and prepending with a space, and capitalizing the first letter
            dataPointName = dataPointName.slice(1, 2).charAt(0).toUpperCase() + dataPointName.slice(2).replace(new RegExp('([A-Z])', 'g'), ' $1').toLowerCase()
        } else {
            var dataPointName =  this.origin.parentSchema.title
        }

        if(this.origin.data.length === 0 ) {
            this.message = `${dataPointName} is required.`
            return
        }

        if (this.origin.keyword == 'minLength') {
            this.message = `${dataPointName} should be longer than ${this.origin.params.limit} ${this.origin.params.limit > 1 ? 'characters' : 'character' }.`
        } else if (this.origin.keyword == 'maxLength') {
            this.message = `${dataPointName} should be shorter than ${this.origin.params.limit} ${this.origin.params.limit > 1 ? 'characters' : 'character' }.`
        }
    }
}

// Enumeration violations
class EnumViolation extends ValidationError {
    constructor(...args) {
        super(...args)

        let dataPointName = this.origin.dataPath
        // dataPointName = dataPointName.slice(dataPointName.lastIndexOf('.') + 1)
        dataPointName = dataPointName.slice(1, 2).charAt(0).toUpperCase() + dataPointName.slice(2).replace(new RegExp('([A-Z])', 'g'), ' $1').toLowerCase()
        this.message = `${dataPointName} contains an invalid value. Value should be equal to one of the allowed values: ${this.origin.params.allowedValues.toString()}.`
    }
}

// Data type violations
class TypeViolation extends ValidationError {
    constructor(...args) {
        super(...args)

        let dataPointName = this.origin.dataPath
        // Removing the . from the front of the AJV error, converting capitalized letters to lowercase and prepending with a space, and capitalizing the first letter
        dataPointName = dataPointName.slice(1, 2).charAt(0).toUpperCase() + dataPointName.slice(2).replace(new RegExp('([A-Z])', 'g'), ' $1').toLowerCase()
        if (dataPointName) {
            this.message = `${dataPointName} contains an invalid data type.`
        } else {
            this.message = `Missing data flagged as invalid data type.`
        }
    }
}

// Additional Properties violations
class AdditionalPropertiesViolation extends ValidationError {
    constructor(...args) {
        super(...args)

        let dataPointName = this.origin.params.additionalProperty
        // Removing the . from the front of the AJV error, converting capitalized letters to lowercase and prepending with a space, and capitalizing the first letter
        //dataPointName = dataPointName.slice(1, 2).charAt(0).toUpperCase() + dataPointName.slice(2).replace(new RegExp('([A-Z])', 'g'), ' $1').toLowerCase()
        this.message = `Request should not contain property - ${dataPointName}.`


    }
}

// Numerical maximum and minimum violations
class NumericalLimitViolation extends ValidationError {
    constructor(...args) {
        super(...args)

        if (this.origin.dataPath) {
            var dataPointName = this.origin.dataPath
            // Removing the . from the front of the AJV error, converting capitalized letters to lowercase and prepending with a space, and capitalizing the first letter
            dataPointName = dataPointName.slice(1, 2).charAt(0).toUpperCase() + dataPointName.slice(2).replace(new RegExp('([A-Z])', 'g'), ' $1').toLowerCase()
        } else {
            var dataPointName =  this.origin.parentSchema.title
        }

        if (this.origin.keyword == 'minimum') {
            this.message = `${dataPointName} should be bigger than ${this.origin.params.limit} characters.`
        } else if (this.origin.keyword == 'maximum') {
            this.message = `${dataPointName} should be smaller than ${this.origin.params.limit} characters.`
        }
    }
}

// Numerical maximum and minimum violations
class DependenciesViolation extends ValidationError {
    constructor(...args) {
        super(...args)

        // This error message isn't really suitable to pass through directly tho the front end.
        this.message = "Request " + this.origin.message.replace(new RegExp('([A-Z])', 'g'), ' $1').toLowerCase()
    }
}

module.exports = {
    ValidationError,
    FormatViolation,
    PatternViolation,
    LengthViolation,
    EnumViolation,
    NumericalLimitViolation,
    TypeViolation,
    RequiredViolation,
    AdditionalPropertiesViolation,
    DependenciesViolation
 }