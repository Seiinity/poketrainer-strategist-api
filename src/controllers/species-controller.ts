import { Request, Response } from "express"

function index(req: Request, res: Response) {
    res.send("Index!");
}

function show(req: Request, res: Response) {
    res.send("Show!");
}

function store(req: Request, res: Response) {
    res.send("Store!");
}

function update(req: Request, res: Response) {
    res.send("Update!");
}

function destroy(req: Request, res: Response) {
    res.send("Destroy!");
}

export default {
    index,
    show,
    store,
    update,
    destroy
}