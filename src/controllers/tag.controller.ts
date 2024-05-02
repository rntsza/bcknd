import { Request, Response } from "express";

class Tag {
  static async getAll(req: Request, res: Response) {
    try {
      const tags = await req.prisma.tag.findMany();
      res.json(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tag = await req.prisma.tag.findUnique({
        where: { id: parseInt(id) },
      });
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      res.json(tag);
    } catch (error) {
      console.error('Error fetching tag by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { nome } = req.body;
      const tag = await req.prisma.tag.create({
        data: {
          nome,
        },
      });
      res.status(201).json(tag);
    } catch (error) {
      console.error('Error creating tag:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome } = req.body;
      const tag = await req.prisma.tag.update({
        where: { id: parseInt(id) },
        data: {
          nome,
        },
      });
      res.json(tag);
    } catch (error) {
      console.error('Error updating tag:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await req.prisma.tag.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
      console.error('Error deleting tag:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default Tag;
