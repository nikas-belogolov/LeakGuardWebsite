export default function FormInput({
    inputGroupText,
    errorMessage,
    inputProps,
    label,
}:
{
    inputGroupText?: string,
    errorMessage: string,
    inputProps: any,
    label: string
}) {

    const { value, name, type = "text", min, max } = inputProps;

    return (
        <>
            <label htmlFor={ inputProps.name } className="form-label">{ label }</label>
            <div className="input-group">
                { (type == "number") &&  <input min={min} max={max} defaultValue={value} name={name} type={type} className={"form-control" + (errorMessage ? ' is-invalid' : "")} />}
                { (type != "number") &&  <input defaultValue={value} name={name} type={type} className={"form-control" + (errorMessage ? ' is-invalid' : "")} />}
                

                { inputGroupText && <span className="input-group-text">{inputGroupText}</span>}
                <div className="invalid-feedback">
                    {errorMessage}
                </div>
            </div>
        </>
    )
}