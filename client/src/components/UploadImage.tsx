import React, { ChangeEvent, Component } from "react";
import axios from "axios";

interface UploadImgState {
    selectedFile: File | null;
}

class UploadImg extends Component {
    state = {
        selectedFile: null,
    };
    fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            selectedFile: event.target.files[0]
        })
        console.log(event.target.files[0]);

    }
    fileUploadHandler = () => {
        const fd = new FormData();
        fd.append('image', this.state.selectedFile, this.state.selectedFile.name);
        axios.post('', fd);
            // onUploadProgress: ProgressEvent => {
            //     console.log('Upload Progress: ' + (ProgressEvent.loaded / ProgressEvent.total * 100) + '%')
            // }
            .then((res: AxiosResponse) => {
                console.log(res);
            });
    }

    render() {
        return (
            <div className="UploadImg">
                <input style={{display: 'none'}} type="file" 
                onChange={this.fileSelectedHandler}
                ref={fileInput => this.fileInput = fileInput}/>
                <button onClick={() => this.fileInput.click()}>Select file</button>
                <button onClick={this.fileSelectedHandler}>Upload</button>
            </div>
        )
    }
}