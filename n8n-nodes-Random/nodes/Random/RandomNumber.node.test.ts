import { RandomNumber } from "./RandomNumber.node";
import { IExecuteFunctions, INodeExecutionData, INode } from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

describe("RandomNumber Node - Deterministic Tests", () => {
  let node: RandomNumber;
  let mockContext: Partial<IExecuteFunctions> & { helpers: any };

  beforeEach(() => {
    node = new RandomNumber();

    mockContext = {
      getNodeParameter: jest.fn(),
      helpers: {
        httpRequest: jest.fn(),
        returnJsonArray: jest.fn(
          (data: INodeExecutionData[]) => data as INodeExecutionData[]
        ),
      },
      getNode: jest.fn(() => {
        // Provide all required properties for INode
        const mockNode: INode = {
          id: "1",
          name: "RandomNumber",
          type: "RandomNumber",
          typeVersion: 1,
          position: [0, 0],
          parameters: {},
        };
        return mockNode;
      }),
      // Add any other required properties/methods as needed
    } as unknown as IExecuteFunctions;
  });

  test("Gera número aleatório dentro do intervalo especificado", async () => {
    (mockContext.getNodeParameter as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === "minValue") return 5;
        if (name === "maxValue") return 10;
        return 0;
      }
    );

    (mockContext.helpers.httpRequest as jest.Mock).mockResolvedValue("7\n");

    const result = await node.execute.call(mockContext as IExecuteFunctions);
    const random = result[0][0].random;
    expect(random).toBeGreaterThanOrEqual(5);
    expect(random).toBeLessThanOrEqual(10);
    expect(random).toBe(7);
  });

  test("Lança erro se min > max", async () => {
    (mockContext.getNodeParameter as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === "minValue") return 10;
        if (name === "maxValue") return 5;
        return 0;
      }
    );

    await expect(
      node.execute.call(mockContext as IExecuteFunctions)
    ).rejects.toThrow(NodeOperationError);
  });

  test("Lança erro se min ou max não forem inteiros", async () => {
    (mockContext.getNodeParameter as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === "minValue") return 1.5;
        if (name === "maxValue") return 10;
        return 0;
      }
    );

    await expect(
      node.execute.call(mockContext as IExecuteFunctions)
    ).rejects.toThrow(NodeOperationError);
  });

  test("Lança erro se a resposta da API não for um número válido", async () => {
    (mockContext.getNodeParameter as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === "minValue") return 1;
        if (name === "maxValue") return 10;
        return 0;
      }
    );

    (mockContext.helpers.httpRequest as jest.Mock).mockResolvedValue(
      "not-a-number"
    );

    await expect(
      node.execute.call(mockContext as IExecuteFunctions)
    ).rejects.toThrow(NodeOperationError);
  });

  test("Retorna resultado no formato esperado pelo n8n", async () => {
    (mockContext.getNodeParameter as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === "minValue") return 1;
        if (name === "maxValue") return 1;
        return 0;
      }
    );

    (mockContext.helpers.httpRequest as jest.Mock).mockResolvedValue("1\n");

    const result = await node.execute.call(mockContext as IExecuteFunctions);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0][0]).toHaveProperty("random", 1);
  });
});
