import { AssertionError } from 'assert';
import { API, Updates, Upload } from 'vk-io';
import { ExtendedMessageContext, UPLOAD, VK_API } from '../common/vk';
import { config } from '../config';

export class Bot {
  private readonly _updates!: Updates;

  static useFactory() {
    return new Bot(VK_API, UPLOAD);
  }

  private constructor(api: API, upload: Upload) {
    this._updates = new Updates({ api, upload });
  }

  async start() {
    await this._loadMiddlewares();
    this._updates.start();
  }

  private async _loadMiddlewares() {
    this._updates.use(this.onError);
    this._updates.on('message_new', this.onMessage);

    console.log('middlewares loaded');
  }

  private get onMessage() {
    return async (context: ExtendedMessageContext, next: () => Promise<void>) => {
      context.isAdmin = context.senderId === config.ownerId || config.adminIds.includes(context.senderId);
      await context.send('ку');

      await next();
    };
  }

  private get onError() {
    return async (context: ExtendedMessageContext, next: () => Promise<void>) => {
      try {
        await next();
      } catch (error) {
        if (!context.is(['message'])) throw error;

        if (error instanceof AssertionError) {
          context.send(error.message);
        }

        throw error;
      }
    };
  }
}

export const bot = Bot.useFactory();
