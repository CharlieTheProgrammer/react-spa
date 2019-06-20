import Ajv from 'ajv'
import * as schemas from '../../models/schemas'
import {
    PatternViolation,
    FormatViolation,
    LengthViolation,
    EnumViolation,
    NumericalLimitViolation,
    RequiredViolation,
    TypeViolation,
    AdditionalPropertiesViolation,
    DependenciesViolation
} from './ValidationError'


let schema_arr = []
for (let schema in schemas) {
    schema_arr.push(schemas[schema])
}

let ajv = new Ajv({
    verbose: true,
    missingRefs: 'fail',
    allErrors: false

}).addSchema(schema_arr)


function formatError(err) {
    switch (err.keyword) {
        case 'required':
            return new RequiredViolation(err)
            break;
        case 'pattern':
            return new PatternViolation(err)
            break;
        case 'format':
            return new FormatViolation(err)
            break;
        case 'minLength':
            return new LengthViolation(err)
            break;
        case 'maxLength':
            return new LengthViolation(err)
            break;
        case 'maximum':
            return new NumericalLimitViolation(err)
            break;
        case 'minimum':
            return new NumericalLimitViolation(err)
            break;
        case 'enum':
            return new EnumViolation(err)
            break;
        case 'type':
            return new TypeViolation(err)
            break;
        case 'additionalProperties':
            return new AdditionalPropertiesViolation(err)
            break;
        case 'dependencies':
            return new DependenciesViolation(err)
            break;
        default:
            return new Error("Input is invalid.")
            break;
    }
}

// Dynamically generates and exports validator functions
let validators = {}
schema_arr.forEach(schema => {
    let functionName = schema.$id.split('.')[0]
    let func =  (input) => {
        let validator = ajv.compile(schemas[functionName])
        validator(input)
        if (validator.errors) return formatError(validator.errors[0])
        return false
    }
    validators[functionName] = func
})



export default validators