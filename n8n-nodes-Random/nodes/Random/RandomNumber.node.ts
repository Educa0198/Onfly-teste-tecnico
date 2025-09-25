import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
} from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

export class RandomNumber implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Random",
    name: "Random",
    icon: "file:RandomNumber.svg",
    group: ["transform"],
    version: 1,
    description: "Generates a random number between min and max values",
    defaults: {
      name: "Random Number",
    },
    inputs: ["main"],
    outputs: ["main"],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        options: [
          {
            name: "True Random Number Generator",
            value: "trueRandomNumber",
          },
        ],
        default: "trueRandomNumber",
        description: "Choose the operation to perform",
      },

      {
        displayName: "Min",
        name: "minValue",
        type: "number",
        typeOptions: {
          numberPrecision: 0,
        },
        default: 1,
        description: "Minimum value for the random number generation",
      },

      {
        displayName: "Max",
        name: "maxValue",
        type: "number",
        typeOptions: {
          numberPrecision: 0,
        },
        default: 60,
        description: "Maximum value for the random number generation",
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const min = this.getNodeParameter("minValue", 0) as number;
    const max = this.getNodeParameter("maxValue", 0) as number;

    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new NodeOperationError(
        this.getNode(),
        "Both Min and Max must be integers."
      );
    }

    if (min > max) {
      throw new NodeOperationError(
        this.getNode(),
        "Min cannot be greater than Max."
      );
    }
    const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

    try {
      const response = await this.helpers.httpRequest({
        method: "GET",
        url,
        headers: { 'Accept': 'text/plain' },
      });

      const randomNumber = parseInt(String(response).trim(), 10);

      if (isNaN(randomNumber)) {
        throw new Error("Random.org did not return a valid number");
      }

      return [this.helpers.returnJsonArray([{ random: randomNumber }])];
    } catch (error) {
      throw new NodeOperationError(this.getNode(), error);
    }
  }
}
