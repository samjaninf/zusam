import { h, render, Component } from "preact";
import bee from "./bee.js";
import nlg from "./nlg.js";
import FaIcon from "./fa-icon.component.js";

export default class FileGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {files: []};
        if (Array.isArray(props.files)) {
            props.files.forEach((e,i) => {
                if (typeof(e) == "string") {
                    bee.get(e).then(r => {
                        let a = this.state.files;
                        a.splice(r.fileIndex, 0, r);
                        this.setState({files: a})
                    });
                }
                if (typeof(e) == "object") {
                    let a = this.state.files;
                    a.splice(e.fileIndex, 0, e);
                    this.setState({files: a});
                }
            });
        }
    }

    renderFile(file, miniature = false) {
        let filePath = file.contentUrl ? "/files/" + file.contentUrl : null;
        let url = filePath;
        if (/image/.test(file.type)) {
            url = bee.thumbnail(filePath, 1366, 768);
        }
        if (miniature == true) {
            if (file.status == "ready") {
                return (
                    <a data-nlg href={url} class="rounded">
                        <div class="miniature" style={"background-image:url('" + bee.crop(filePath, 160, 160) + "')"}></div>
                    </a>
                );
            }
            if (file.status == "raw") {
                return (
                    <a class="rounded">
                        <div class="miniature"><FaIcon family={"regular"} icon={"check-circle"} /></div>
                    </a>
                );
            }
            return (
                <a class="rounded">
                    <div class="miniature video-raw" style={"background-image:url('" + bee.crop(filePath, 160, 160) + "')"}></div>
                    <div class="spinner orange-spinner"><div></div><div></div><div></div><div></div><div></div></div>
                </a>
            );
        }
        if (file.contentUrl) {
            if (/video/.test(file.type)) {
                if (file.status == "ready") {
                    return <video
                        poster={bee.thumbnail(filePath, 1280, 720)}
                        class="img-fluid contained-height video"
                        controls="true"
                        src={url}
                    ></video>;
                }
                return (
                    <a class="image video-uploaded">
                        <img class="img-fluid video-raw" src={bee.crop(filePath, 320, 180)}></img>
                        <div class="spinner orange-spinner"><div></div><div></div><div></div><div></div><div></div></div>
                    </a>
                );
            }
            if (/image/.test(file.type)) {
                return (
                    <a class="image" data-nlg href={url}>
                        <img class="img-fluid" src={url}></img>
                    </a>
                );
            }
        }
        return (
            <div class="file-placeholder">
                <div class="spinner orange-spinner"><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        );
    }

    render() {
        if (!this.props.files || this.props.files.length === 0) {
            return null;
        }
        if (this.props.files && this.props.files.length > 3) {
            return (
                <div class="file-grid">
                    { this.state.files.sort((a, b) => a.fileIndex > b.fileIndex ? 1 : -1).map(e => this.renderFile(e, true)) }
                </div>
            );
        }
        return (
            <div class="d-flex justify-content-center flex-wrap">
				{ this.state.files.sort((a, b) => a.fileIndex > b.fileIndex ? 1 : -1).map(e => this.renderFile(e)) }
            </div>
        );
    }

    componentDidMount() {
        nlg.start();
    }

    componentDidUpdate() {
        nlg.start();
    }
}
