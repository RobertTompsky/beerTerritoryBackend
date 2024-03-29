import { prisma } from "@/prisma/script";
import { handleServerError } from "@/utils/handleServerError";
import { Beer } from "@prisma/client"
import { Request, Response } from 'express';

export const getSelectedBeer = async (req: Request, res: Response) => {
    const { beerId } = req.params

    try {
        const selectedBeer: Beer = await prisma.beer.findUnique({
            where: { id: beerId }
        })

        if (selectedBeer) {
            const selectedBeerWithViewsIncreased = await prisma.beer.update({
                where: { id: beerId },
                include: {
                    favouriteInUsers: {
                        select: {
                            id: true,
                            nickName: true
                        }
                    }
                },
                data: {
                    viewsCount: {
                        increment: 1
                    }
                }
            })
            return res.status(200).json(selectedBeerWithViewsIncreased)
        } else {
            return res.status(400).json({
                message: 'Такого пива не существует'
            })
        }

    } catch (error) {
        handleServerError(res, 'Не удалось найти пиво', error)
    }
}