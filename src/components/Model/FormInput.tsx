import { Checkbox, DatePicker, Input, Select, Switch } from "antd";
import TextArea from "antd/lib/input/TextArea";

export const FormInput = (
  fieldInfo,
  fieldName,
  uniqueName,
  initialData,
  isProductSubmitted,
  handleInputChange,
  handleDateChange
) => {
  switch (fieldInfo?.fields.fieldType) {
    case "number":
      return (
        <div>
          <p>
            {fieldName} {fieldInfo?.fields.required && "*"}
          </p>
          {initialData[fieldName] !== undefined ? (
            <Input
              key={uniqueName}
              name={uniqueName}
              type="number"
              defaultValue={initialData[fieldName]}
              disabled
            />
          ) : (
            <Input
              key={uniqueName}
              name={uniqueName}
              type="number"
              onChange={(e) =>
                handleInputChange(uniqueName, Number(e.target.value))
              }
              defaultValue={initialData[fieldName]}
              disabled={isProductSubmitted}
            />
          )}
        </div>
      );
    case "string":
      return (
        <div>
          <p>
            {fieldName} {fieldInfo?.fields.required && "*"}
          </p>
          {initialData[fieldName] !== undefined ? (
            <Input
              key={uniqueName}
              name={uniqueName}
              defaultValue={initialData[fieldName]}
              disabled
            />
          ) : (
            <Input
              key={uniqueName}
              name={uniqueName}
              onChange={(e) => handleInputChange(uniqueName, e.target.value)}
              defaultValue={initialData[fieldName]}
              disabled={isProductSubmitted}
            />
          )}
        </div>
      );
    case "date":
      return (
        <div>
          <p>
            {fieldName} {fieldInfo?.fields.required && "*"}
          </p>
          {initialData[fieldName] !== undefined ? (
            <Input
              key={uniqueName}
              name={uniqueName}
              defaultValue={initialData[fieldName]}
              disabled
            />
          ) : (
            <DatePicker
              key={uniqueName}
              name={uniqueName}
              onChange={(date, dateString) =>
                handleDateChange(uniqueName, date, dateString)
              }
              disabled={isProductSubmitted}
            />
          )}
        </div>
      );
    case "multilineString":
      return (
        <div>
          <p>
            {fieldName} {fieldInfo?.fields.required && "*"}
          </p>
          {initialData[fieldName] !== undefined ? (
            <TextArea
              key={uniqueName}
              name={uniqueName}
              defaultValue={initialData[fieldName]}
              disabled
            />
          ) : (
            <TextArea
              key={uniqueName}
              name={uniqueName}
              onChange={(e) => handleInputChange(uniqueName, e.target.value)}
              defaultValue={initialData[fieldName]}
              disabled={isProductSubmitted}
            />
          )}
        </div>
      );
    case "enum":
      const options = fieldInfo?.fields.keyOptions || [];
      return (
        <div>
          <p>
            {fieldName} {fieldInfo?.fields.required && "*"}
          </p>
          {initialData[fieldName] !== undefined ? (
            <Select
              style={{ width: "100%" }}
              key={uniqueName}
              defaultValue={initialData[fieldName]}
              disabled
            >
              {options.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <Select
              style={{ width: "100%" }}
              key={uniqueName}
              onChange={(value) => handleInputChange(uniqueName, value)}
              defaultValue={initialData[fieldName]}
              disabled={isProductSubmitted}
            >
              {options.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          )}
        </div>
      );
    case "boolean":
      // Check if multiple keyOptions are available
      if (
        fieldInfo.fields.keyOptions &&
        fieldInfo.fields.keyOptions.length > 1
      ) {
        return (
          <div>
            <p>
              {fieldName} {fieldInfo?.fields.required && "*"}
            </p>
            {fieldInfo.fields.keyOptions.map((option, index) => {
              const checkboxName = `${uniqueName}-option-${index}`;
              const setDataCheckboxName = `${fieldName}-option-${index}`;
              if (isProductSubmitted) {
                return (
                  <div key={checkboxName}>
                    {initialData[setDataCheckboxName] !== undefined ? (
                      <Checkbox
                        key={checkboxName}
                        name={checkboxName}
                        checked={initialData[setDataCheckboxName] === true}
                        disabled
                      >
                        {option}
                      </Checkbox>
                    ) : (
                      <Checkbox
                        key={checkboxName}
                        name={checkboxName}
                        onChange={(e) =>
                          handleInputChange(checkboxName, e.target.checked)
                        }
                        checked={initialData[setDataCheckboxName] === true}
                        disabled={isProductSubmitted}
                      >
                        {option}
                      </Checkbox>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={checkboxName}>
                    {initialData[setDataCheckboxName] !== undefined ? (
                      <Checkbox
                        key={checkboxName}
                        name={checkboxName}
                        defaultChecked={
                          initialData[setDataCheckboxName] === true
                        }
                        disabled
                      >
                        {option}
                      </Checkbox>
                    ) : (
                      <Checkbox
                        key={checkboxName}
                        name={checkboxName}
                        onChange={(e) =>
                          handleInputChange(checkboxName, e.target.checked)
                        }
                        defaultChecked={
                          initialData[setDataCheckboxName] === true
                        }
                        disabled={isProductSubmitted}
                      >
                        {option}
                      </Checkbox>
                    )}
                  </div>
                );
              }
            })}
          </div>
        );
      } else {
        return (
          <div>
            <p>
              {fieldName} {fieldInfo?.fields.required && "*"}
            </p>
            {initialData[fieldName] !== undefined ? (
              <Checkbox
                key={uniqueName}
                name={uniqueName}
                checked={initialData[fieldName] === true}
                disabled
              />
            ) : (
              <Checkbox
                key={uniqueName}
                name={uniqueName}
                onChange={(e) =>
                  handleInputChange(uniqueName, e.target.checked)
                }
                checked={initialData[fieldName] === true}
                disabled={isProductSubmitted}
              />
            )}
          </div>
        );
      }
    case "toggle":
      return (
        <div>
          <p>
            {fieldName} {fieldInfo?.fields.required && "*"}
          </p>
          {initialData[fieldName] !== undefined ? (
            <Switch
              key={uniqueName}
              checked={initialData[fieldName]}
              disabled
            />
          ) : (
            <Switch
              key={uniqueName}
              onChange={(checked) => handleInputChange(uniqueName, checked)}
              checked={initialData[fieldName]}
              disabled={isProductSubmitted}
            />
          )}
        </div>
      );
    default:
      return null;
  }
};
