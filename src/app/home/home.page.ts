import {Component} from '@angular/core';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {Entry, File} from '@ionic-native/file/ngx';
import {ToastController} from '@ionic/angular';

interface SharedData {
    text: string;
    imageUrl: string;
}

enum SupportedSocialProviders {
    'Twitter',
    'Facebook',
    'NativeShare'
}

const ASSETS_URL = 'assets/images';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    public sharedData: SharedData = {
        text: 'Hey! Check this up!',
        imageUrl: 'ionic-framework.png'
    };
    fileUrl = this.file.applicationDirectory + ASSETS_URL + 'ionic-framework.png';
    public socialProviders: any[] = ['Twitter', 'Facebook', 'NativeShare'];

    constructor(
        private readonly socialSharing: SocialSharing,
        private readonly file: File,
        private readonly toastController: ToastController,
    ) {
    }

    public async share(provider: 'Twitter' | 'Facebook' | 'NativeShare'): Promise<void> {
        const {text, imageUrl} = this.sharedData;
        // wanted to use local picture but couldn't make it read from local store
        const file = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Ionic-logo-landscape.svg/1200px-Ionic-logo-landscape.svg.png';

        try {
            const isShared = await this[`shareVia${provider}`](text, file);
            if (isShared) {  // only show success popup if it was actually shared
                this.presentToastWithOptions('Success');
            }
        }
        catch (err) {
            console.log(err);
            this.presentToastWithOptions('Fail');
        }
    }

    private shareViaTwitter(message, file): Promise<unknown> {
        return this.socialSharing.shareViaTwitter(message, file);

    }

    private shareViaFacebook(message, file): Promise<unknown> {
        return this.socialSharing.shareViaFacebook(message, file); // at least we can send a file, message is not added by any way

    }

    private async shareViaNativeShare(message, file): Promise<unknown> {
        return this.socialSharing.share(message, '', file);
    }

    private async resolveLocalFile(fileName: string, newFileName = `${new Date().getTime()}.jpg`): Promise<Entry> {
        return this.file.copyFile(
            `${this.file.applicationDirectory}/www/assets/images`,
            fileName,
            this.file.cacheDirectory, `${newFileName}`
        );
    }

    private async presentToastWithOptions(message: 'Success' | 'Fail'): Promise<void> {
        const toast = await this.toastController.create({
            message,
            color: message === 'Success' ? 'primary' : 'danger',
            position: 'top',
            duration: 3000,
            buttons: [{
                text: 'OK',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }
            ]
        });
        toast.present();
    }
}
