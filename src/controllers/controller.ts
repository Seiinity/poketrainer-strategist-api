import { NameLookupService, ReadOnlyService, Service } from "../services/service";
import { Request, Response } from "express";

export class ReadOnlyController<TModel>
{
    protected readonly service: ReadOnlyService<TModel>;

    constructor(service: ReadOnlyService<TModel>)
    {
        this.service = service;
    }

    index = async (_req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const data = await this.service.find();
            res.json(data);
        }
        catch (error)
        {
            this.handleError(res, error);
        }
    };

    show = async (req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const id = parseInt(req.params.id);
            const data = await this.service.getById(id);

            if (!data) res.status(404).json({ error: "Not found." });
            else res.json(data);
        }
        catch (error)
        {
            this.handleError(res, error);
        }
    };

    protected handleError = (res: Response, error: unknown): void =>
    {
        res.status(500).json({ error: `${(error as Error).message}` });
    };
}

export class Controller<TModel, TBody> extends ReadOnlyController<TModel>
{
    protected declare readonly service: Service<TModel, TBody>;
    private readonly bodyClass: { new(requestBody: Request["body"]): TBody };

    constructor(service: Service<TModel, TBody>, bodyClass: { new(requestBody: Request["body"]): TBody })
    {
        super(service);
        this.bodyClass = bodyClass;
    }

    store = async (req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const newEntry = new this.bodyClass(req.body);
            const inserted = await this.service.create(newEntry);
            res.status(200).json(inserted);
        }
        catch (error)
        {
            this.handleError(res, error);
        }
    };

    update = async (req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const id = parseInt(req.params.id);
            const newEntry = new this.bodyClass(req.body);
            const updated = await this.service.update(id, newEntry);

            if (!updated) res.status(404).json({ error: "Not found." });
            else res.status(200).json(updated);
        }
        catch (error)
        {
            this.handleError(res, error);
        }
    };

    destroy = async (req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const id = parseInt(req.params.id);
            const result = await this.service.delete(id);

            if (!result) res.status(404).json({ error: "Not found." });
            else res.json(`Entry with ID ${id} deleted.`);
        }
        catch (error)
        {
            this.handleError(res, error);
        }
    };
}

export class NameLookupController<TModel, TBody> extends Controller<TModel, TBody>
{
    protected declare service: NameLookupService<TModel, TBody>;

    constructor(service: NameLookupService<TModel, TBody>, bodyClass: { new(requestBody: Request["body"]): TBody })
    {
        super(service, bodyClass);
    }

    show = async (req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const idName = req.params.idName;
            const data = !isNaN(Number(idName))
                ? await this.service.getById(parseInt(idName))
                : await this.service.getByName(idName);

            if (!data) res.status(404).json({ error: "Not found." });
            else res.json(data);
        }
        catch (error)
        {
            this.handleError(res, error);
        }
    };
}
