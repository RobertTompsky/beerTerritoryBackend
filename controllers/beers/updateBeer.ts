import { Beer } from "@prisma/client"
import { prisma } from "../../prisma/script"
import { BeerInputData } from "../../types/types"
import { Request, Response } from 'express';
import { handleServerError } from "../../utils/handleServerError";

export const updateBeer = async (req: Request, res: Response) => {
    const { beerId } = req.params
    const { name, brewery, type, ibu, abv, og, volume, format, image }: BeerInputData = req.body

    try {
        const existingBeer: Beer = await prisma.beer.findUnique({
            where: { id: beerId }
        })

        if (existingBeer) {
            const updatedExistingBeer = await prisma.beer.update({
                where: { id: beerId },
                data: {
                    name,
                    brewery,
                    type,
                    ibu,
                    abv,
                    og,
                    volume,
                    format,
                    image,
                }
            })

            return res.status(200).json(updatedExistingBeer)
        } else {
            return res.status(400).json({
                message: 'Такого пива нет'
            })
        }
    } catch (error) {
        handleServerError(res, 'Не удалось обновить пиво', error)
    }
}