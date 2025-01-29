import { raw } from "@prisma/client/runtime/library";
import prisma from "../../client";
import { notFound } from "../controller/errorHandler";
import { Product } from "../interface/product.interface";
import { Role } from "../interface/utils.types";

class ProductService {
  private operationMap: any = {
    ">": "gt",
    ">=": "gte",
    "<": "lt",
    "<=": "lte",
    "=": "equals",
    "-": "desc",
    "+": "asc",
  };

  private regex = /\b(<|>|>=|=|<|>=)\b/g;
  private sortRegex = /[+-]/g;

  newProduct = async (data: Product) => {
    try {
      return await prisma.product.create({ data: { ...data } });
    } catch (e) {
      return e;
    }
  };

  product = async (productId: number, role: Role) => {
    try {
      const select: any = {
        category: true,
        created_at: true,
        description: true,
        id: true,
        name: true,
        price: true,
        quantity: true,
        updated_at: true,
      };

      if (role === "admin" || role === "super-admin") select.deleted = true;

      const product = await prisma.product.findUnique({
        where: { id: productId, deleted: false },
        select: select,
      });
      if (!product) return notFound("Product");

      return product;
    } catch (error) {
      return error;
    }
  };

  products = async (
    search: { name: string; description: string; category: string },
    filter: string,
    sort: string,
    page = 1,
    limit = 10
  ) => {
    try {
      const query: any = { deleted: false };
      const sortObj: any[] = [];

      const productPage = page ? +page : 1;
      const productLimit = limit ? +limit : 12;
      const skip = (productPage - 1) * productLimit;

      if (
        !search.name &&
        !search.category &&
        !search.description &&
        !filter &&
        !sort
      ) {
        const total = await prisma.product.count({ where: { deleted: false } });

        // https://github.com/prisma/prisma/discussions/5886#discussioncomment-2161126
        const randomPick = (values: string[]) => {
          const index = Math.floor(Math.random() * values.length);
          return values[index];
        };
        const randomNumber = (min: number, max: number) => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        const orderBy = randomPick(["name", "category", "price", "quantity"]);
        const orderDir = randomPick(["asc", "desc"]);

        const products = await prisma.product.findMany({
          where: { deleted: false },
          orderBy: { [orderBy]: orderDir },
          take: productLimit,
          skip,
        });

        return { products, total };
      }

      if (search) {
        if (search.name) {
          query.name = { contains: search.name, mode: "insensitive" };
        }
        if (search.description) {
          query.description = {
            contains: search.description,
            mode: "insensitive",
          };
        }
        if (search.category) {
          query.category = { contains: search.category, mode: "insensitive" };
        }
      }

      if (filter) {
        const filterOption = ["price", "quantity"];
        let filters = filter.replace(
          this.regex,
          (match: string) => `-${this.operationMap[match]}-`
        );
        //query.price={gt:10}
        filters
          .split(" ")
          .join()
          .split(",")
          .forEach((item) => {
            const [field, operator, value] = item.split("-");
            if (filterOption.includes(field)) {
              query[field] = { [operator]: +value };
            }
          });
      }
      if (sort) {
        const sortOption = ["price", "quantity", "name"];
        let sorts = sort.replace(
          this.sortRegex,
          (match: string) => `${this.operationMap[match]}-`
        );
        //[{price:'asc'}]
        sorts
          .split(" ")
          .join()
          .split(",")
          .forEach((item) => {
            const [value, field] = item.split("-");
            if (sortOption.includes(field)) {
              sortObj.push({ [field]: value });
            }
          });
      }

      const products = await prisma.product.findMany({
        where: query,
        orderBy: sortObj,
        skip,
        take: productLimit,
      });
      const total = await prisma.product.count({ where: query });
      return { total, products };
    } catch (error) {
      console.log(error);

      return error;
    }
  };

  editProduct = async (productId: number, data: Product) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId, deleted: false },
        select: { id: true },
      });
      if (!product) return notFound("Product");

      return await prisma.product.update({
        where: { id: productId },
        data: { ...data, updated_at: new Date() },
      });
    } catch (error) {
      return error;
    }
  };

  deleteProduct = async (productId: number) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId, deleted: false },
        select: { id: true },
      });
      if (!product) return notFound("Product");

      return await prisma.product.update({
        where: { id: productId },
        data: { deleted: true },
      });
    } catch (e) {
      return e;
    }
  };
}

export default new ProductService();
