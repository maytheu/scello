import { prismaMock } from "../../singleton";
import { Product } from "../interface/product.interface";
import { Role } from "../interface/utils.types";
import ProductService from "../service/Product.service";

describe("ProductService()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("newProduct()", () => {
    const sut = ProductService.newProduct;
    const actual: Product = {
      name: "Product test",
      category: "Test",
      description: "Test product",
      price: 100,
      quantity: 4,
    };

    it("Should created new product", async () => {
      const mockProduct = {
        id: 1,
        ...actual,
        updated_at: new Date(),
        created_at: new Date(),
        deleted: false,
      };

      prismaMock.product.create.mockResolvedValue(mockProduct);

      const expected = await sut(actual);

      expect(expected).toEqual(mockProduct);
    });

    it("Should return error in catch {}", async () => {
      const error = new Error("Error occured");

      prismaMock.product.create.mockRejectedValue(error);

      const expected: any = await sut(actual);

      expect(expected.toString()).toBe("Error: Error occured");
    });
  });

  describe("product()", () => {
    const sut = ProductService.product;
    const actual = { id: 1, role: "admin" };

    it("Should return product not found", async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      const expected: any = await sut(actual.id, actual.role as Role);

      expect(expected.toString()).toBe("Error: Product not found");
    });

    it("Should return product detail", async () => {
      const mockProduct = {
        id: 1,
        name: "Product test",
        category: "Test",
        description: "Test product",
        price: 100,
        quantity: 4,
        updated_at: new Date(),
        created_at: new Date(),
        deleted: false,
      };

      prismaMock.product.findUnique.mockResolvedValue(mockProduct);

      const expected: any = await sut(actual.id, actual.role as Role);

      expect(expected).toEqual(mockProduct);
    });

    it("Should return error in catch {}", async () => {
      const error = new Error("Error occured");

      prismaMock.product.findUnique.mockRejectedValue(error);

      const expected: any = await sut(actual.id, actual.role as Role);

      expect(expected.toString()).toBe("Error: Error occured");
    });
  });

  describe("products()", () => {
    const sut = ProductService.products;
    const mockProducts = [
      {
        id: 1,
        name: "Product test",
        category: "Test",
        description: "Test product",
        price: 100,
        quantity: 4,
        updated_at: new Date(),
        created_at: new Date(),
        deleted: true,
      },
      {
        id: 2,
        name: "Product test2",
        category: "Test",
        description: "Test product2",
        price: 1000,
        quantity: 6,
        updated_at: new Date(),
        created_at: new Date(),
        deleted: true,
      },
    ];
    it("Should return products if query is not passed", async () => {
      prismaMock.product.count.mockResolvedValue(2)
      prismaMock.product.count.mockResolvedValue(2)
      prismaMock.product.findMany.mockResolvedValue(mockProducts);

      const expected: any = await sut(
        { name: "", description: "", category: "" },
        "",
        ""
      );

      expect(expected.products).toEqual(mockProducts);
      expect(expected.total).toBe(2);
    });

    it("Should return products if query is  passed", async () => {
      prismaMock.product.count.mockResolvedValue(2)
      prismaMock.product.findMany.mockResolvedValue(mockProducts);

      const expected: any = await sut(
        { name: "test", description: "test", category: "test" },
        "price>=100",
        "-quantity"
      );

      expect(expected.products).toEqual(mockProducts);
      expect(expected.total).toBe(2);
    });

    it("Should return error in catch {}", async () => {
      const error = new Error("Error occured");

      prismaMock.product.findMany.mockRejectedValue(error);

      const expected: any = await sut(
        { name: "", description: "", category: "" },
        "",
        ""
      );

      expect(expected.toString()).toBe("Error: Error occured");
    });
  });

  describe("EditProduct()", () => {
    const sut = ProductService.editProduct;
    const actual: Product = {
      name: "Product test",
      category: "Test",
      description: "Test product",
      price: 100,
      quantity: 4,
    };
    const actualId = 1;
    it("Should return product not found", async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      const expected: any = await sut(actualId, actual);

      expect(expected.toString()).toBe("Error: Product not found");
    });

    it("Should update product", async () => {
      const mockProduct = {
        ...actual,
        id: 1,
        updated_at: new Date(),
        created_at: new Date(),
        deleted: false,
      };

      prismaMock.product.findUnique.mockResolvedValue(mockProduct);

      prismaMock.product.update.mockResolvedValue(mockProduct);

      const expected: any = await sut(actualId, actual);

      expect(expected).toEqual(mockProduct);
    });

    it("Should return error in catch {}", async () => {
      const error = new Error("Error occured");

      prismaMock.product.findUnique.mockRejectedValue(error);

      const expected: any = await sut(actualId, actual);

      expect(expected.toString()).toBe("Error: Error occured");
    });
  });

  describe("deleteProduct()", () => {
    const sut = ProductService.deleteProduct;
    const actual = 1;

    it("Should return product not found", async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      const expected: any = await sut(actual);

      expect(expected.toString()).toBe("Error: Product not found");
    });

    it("Should delete product", async () => {
      const mockProduct = {
        id: 1,
        name: "Product test",
        category: "Test",
        description: "Test product",
        price: 100,
        quantity: 4,
        updated_at: new Date(),
        created_at: new Date(),
        deleted: true,
      };
      prismaMock.product.findUnique.mockResolvedValue(mockProduct);

      prismaMock.product.update.mockResolvedValue(mockProduct);

      const expected: any = await sut(actual);

      expect(expected).toEqual(mockProduct);
    });

    it("Should return error in catch {}", async () => {
      const error = new Error("Error occured");

      prismaMock.product.findUnique.mockRejectedValue(error);

      const expected: any = await sut(actual);

      expect(expected.toString()).toBe("Error: Error occured");
    });
  });
});
